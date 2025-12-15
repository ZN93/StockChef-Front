import { SectionCard, KPI } from "../ui/kit";
import { formatCurrency } from "../utils/currency";
import { 
    useDashboardSummary, 
    useProductsInAlert, 
    useExpiringProducts, 
    useRecentProducts,
    calculateDashboardKPIs 
} from "../features/dashboard/api";

const SEUIL_BUDGET = 15.0;
const JOURS_PEREMPTION = 3;

const formatDate = (dateStr: string) => {
    try {
        return new Date(dateStr).toLocaleDateString("fr-FR");
    } catch {
        return dateStr;
    }
};

export default function DashboardPage() {
    const { data: summary, isLoading: isSummaryLoading, isError: isSummaryError } = useDashboardSummary();
    const { data: alerts, isLoading: isAlertsLoading } = useProductsInAlert();
    const { isLoading: isExpiringLoading } = useExpiringProducts(JOURS_PEREMPTION);
    const { data: recentProducts, isLoading: isRecentLoading } = useRecentProducts(5);

    const kpis = calculateDashboardKPIs(summary, alerts);

    const isLoading = isSummaryLoading || isAlertsLoading || isExpiringLoading || isRecentLoading;

    if (isSummaryError) {
        return (
            <div className="grid place-items-center h-64">
                <div className="text-center">
                    <div className="text-red-500 text-lg mb-2">❌ Erreur de chargement</div>
                    <div className="text-gray-600">Impossible de charger les données du dashboard</div>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="grid place-items-center h-64">
                <div className="text-center">
                    <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"></div>
                    <div className="text-gray-600">Chargement des données...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <KPI
                title="Coût moyen (€)"
                value={formatCurrency(kpis?.averageCost || 0)}
                subtitle={`Seuil ${formatCurrency(SEUIL_BUDGET)}`}
                tone={kpis && kpis.averageCost > SEUIL_BUDGET ? "warn" : undefined}
            />
            <KPI
                title="Produits périmés"
                value={String(kpis?.expiredProducts || 0)}
                tone={kpis && kpis.expiredProducts > 0 ? "danger" : undefined}
                subtitle="À retirer du stock"
            />
            <KPI
                title={`Péremption < ${JOURS_PEREMPTION} j`}
                value={String(kpis?.soonToExpireProducts || 0)}
                tone={kpis && kpis.soonToExpireProducts > 0 ? "warn" : undefined}
                subtitle="À consommer d'abord"
            />
            <KPI
                title="Produits en alerte"
                value={String(kpis?.productsInAlert || 0)}
                tone={kpis && kpis.productsInAlert > 0 ? "warn" : undefined}
                subtitle="Stock faible"
            />

            <div className="md:col-span-2">
                <SectionCard
                    title="Derniers produits entrés"
                    actions={
                        <button className="px-3 py-1.5 rounded-full border text-xs">
                            Voir tout
                        </button>
                    }
                >
                    {isRecentLoading ? (
                        <div className="flex justify-center py-8">
                            <div className="animate-spin w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full"></div>
                        </div>
                    ) : recentProducts && recentProducts.length > 0 ? (
                        <table className="w-full text-sm">
                            <thead className="text-left text-gray-500">
                            <tr>
                                <th className="py-2">Produit</th>
                                <th>Quantité</th>
                                <th>Prix u.</th>
                                <th>Date d'entrée</th>
                                <th>Péremption</th>
                            </tr>
                            </thead>
                            <tbody>
                            {recentProducts.map((p) => (
                                <tr key={p.id} className="border-t">
                                    <td className="py-2 font-medium">{p.nom}</td>
                                    <td>
                                        {p.quantiteStock} {p.unite}
                                    </td>
                                    <td>{formatCurrency(p.prixUnitaire)}</td>
                                    <td>{formatDate(p.dateEntree)}</td>
                                    <td className={
                                        p.isUnderAlertThreshold ? "text-red-600 font-medium" :
                                        new Date(p.datePeremption).getTime() - new Date().getTime() < (3 * 24 * 60 * 60 * 1000) 
                                            ? "text-orange-600 font-medium" : ""
                                    }>
                                        {formatDate(p.datePeremption)}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            Aucun produit trouvé
                        </div>
                    )}
                </SectionCard>
            </div>

            <div className="md:col-span-2">
                <SectionCard title="Statistiques d'inventaire">
                    {summary ? (
                        <div className="grid grid-cols-2 gap-4">
                            <div className="text-center p-4 bg-blue-50 rounded-lg">
                                <div className="text-2xl font-bold text-blue-600">
                                    {summary.totalProduits}
                                </div>
                                <div className="text-sm text-blue-800">Total produits</div>
                            </div>
                            <div className="text-center p-4 bg-green-50 rounded-lg">
                                <div className="text-2xl font-bold text-green-600">
                                    {summary.products.filter(p => !p.isUnderAlertThreshold && !p.isExpired).length}
                                </div>
                                <div className="text-sm text-green-800">Stock OK</div>
                            </div>
                            <div className="text-center p-4 bg-orange-50 rounded-lg">
                                <div className="text-2xl font-bold text-orange-600">
                                    {kpis?.productsInAlert || 0}
                                </div>
                                <div className="text-sm text-orange-800">En alerte</div>
                            </div>
                            <div className="text-center p-4 bg-red-50 rounded-lg">
                                <div className="text-2xl font-bold text-red-600">
                                    {kpis?.expiredProducts || 0}
                                </div>
                                <div className="text-sm text-red-800">Périmés</div>
                            </div>
                        </div>
                    ) : (
                        <div className="h-48 grid place-items-center text-gray-400">
                            [Chargement des statistiques...]
                        </div>
                    )}
                </SectionCard>
            </div>
        </div>
    );
}
