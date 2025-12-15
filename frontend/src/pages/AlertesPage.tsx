import SectionCard from "../ui/SectionCard.tsx";
import { Chip} from "../ui/Chip.tsx";
import { 
    useExpiredProducts, 
    useExpiringProducts, 
    useStockAlerts, 
    useMenuBudgetAlerts,
    formatDate,
    getDaysUntilExpiry,
    formatCurrency
} from "../features/alerts/api";

const SEUIL_BUDGET = 4.5;

export default function AlertesPage() {
    // Hooks pour obtenir les données d'alertes
    const { data: expiredProducts, isLoading: isExpiredLoading } = useExpiredProducts();
    const { data: expiringProducts, isLoading: isExpiringLoading } = useExpiringProducts();
    const { data: stockAlerts, isLoading: isStockLoading } = useStockAlerts();
    const { data: menuBudgetAlerts, isLoading: isMenuLoading } = useMenuBudgetAlerts(SEUIL_BUDGET);

    const isLoading = isExpiredLoading || isExpiringLoading || isStockLoading || isMenuLoading;
    return (
        <div className="space-y-6 p-4">
            {/* Loading state */}
            {isLoading && (
                <div className="text-center py-8">
                    <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"></div>
                    <div className="text-gray-600">Chargement des alertes...</div>
                </div>
            )}

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* ------------------ Péremption & Stock ------------------ */}
                <SectionCard title="Péremption & Stock">
                    <div className="space-y-4">
                        {/* Produits périmés */}
                        {expiredProducts && expiredProducts.length > 0 && (
                            <div>
                                <h4 className="font-medium text-red-600 mb-2">Produits périmés</h4>
                                <ul className="space-y-3 text-sm">
                                    {expiredProducts.map((product) => (
                                        <li key={product.id} className="flex items-start gap-3">
                                            <Chip type="danger">Périmé</Chip>
                                            <div>
                                                <div className="font-medium">
                                                    {product.nom} — {product.quantiteStock} {product.unite}
                                                </div>
                                                <div className="text-gray-500">
                                                    Périmé le {formatDate(product.datePeremption)}. Retirer du stock.
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Produits proche péremption */}
                        {expiringProducts && expiringProducts.length > 0 && (
                            <div>
                                <h4 className="font-medium text-orange-600 mb-2">Proche péremption</h4>
                                <ul className="space-y-3 text-sm">
                                    {expiringProducts.map((product) => {
                                        const daysLeft = getDaysUntilExpiry(product.datePeremption);
                                        return (
                                            <li key={product.id} className="flex items-start gap-3">
                                                <Chip type="warn">
                                                    {daysLeft <= 0 ? "Expire" : `${daysLeft}j`}
                                                </Chip>
                                                <div>
                                                    <div className="font-medium">
                                                        {product.nom} — {product.quantiteStock} {product.unite}
                                                    </div>
                                                    <div className="text-gray-500">
                                                        {daysLeft <= 0 
                                                            ? "Expire aujourd'hui" 
                                                            : `Expire dans ${daysLeft} jour${daysLeft > 1 ? 's' : ''}`
                                                        }. Prioriser.
                                                    </div>
                                                </div>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        )}

                        {/* Stock faible */}
                        {stockAlerts && stockAlerts.length > 0 && (
                            <div>
                                <h4 className="font-medium text-yellow-600 mb-2">Stock faible</h4>
                                <ul className="space-y-3 text-sm">
                                    {stockAlerts.map((product) => (
                                        <li key={product.id} className="flex items-start gap-3">
                                            <Chip type="warn">Stock ↓</Chip>
                                            <div>
                                                <div className="font-medium">
                                                    {product.nom} — {product.quantiteStock} {product.unite}
                                                </div>
                                                <div className="text-gray-500">
                                                    Stock sous le seuil de {product.seuil} {product.unite}. Réapprovisionner.
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Aucune alerte */}
                        {!isLoading && 
                         (!expiredProducts?.length && !expiringProducts?.length && !stockAlerts?.length) && (
                            <div className="text-center py-8 text-gray-500">
                                <div className="text-green-600 text-lg mb-2">✅ Aucune alerte</div>
                                <div>Tous les produits sont en bon état</div>
                            </div>
                        )}
                    </div>
                </SectionCard>

                {/* ------------------ Budget Menus ------------------ */}
                <SectionCard title="Budget Menus">
                    <div className="space-y-4">
                        {menuBudgetAlerts && menuBudgetAlerts.length > 0 ? (
                            <>
                                <h4 className="font-medium text-orange-600 mb-2">Dépassements de budget</h4>
                                <ul className="space-y-3 text-sm">
                                    {menuBudgetAlerts.map((menu) => {
                                        const cout = menu.coutTotalIngredients || 0;
                                        const prix = menu.prixVente || 0;
                                        const isOverBudget = cout > SEUIL_BUDGET;
                                        const hasLowMargin = prix > 0 && cout > prix * 0.7;
                                        
                                        return (
                                            <li key={menu.id} className="flex items-start gap-3">
                                                <Chip type="warn">
                                                    {isOverBudget ? "Budget" : "Marge"}
                                                </Chip>
                                                <div>
                                                    <div className="font-medium">{menu.nom}</div>
                                                    <div className="text-gray-500">
                                                        {isOverBudget && (
                                                            <>Coût {formatCurrency(cout)} &gt; seuil {formatCurrency(SEUIL_BUDGET)}</>
                                                        )}
                                                        {hasLowMargin && !isOverBudget && (
                                                            <>Marge faible: coût {formatCurrency(cout)} / prix {formatCurrency(prix)}</>
                                                        )}
                                                    </div>
                                                </div>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </>
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                {isLoading ? (
                                    <div>Chargement des données de menus...</div>
                                ) : (
                                    <>
                                        <div className="text-green-600 text-lg mb-2">✅ Budgets OK</div>
                                        <div>Tous les menus respectent le budget</div>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </SectionCard>
            </div>

            {/* Statistiques résumé */}
            {!isLoading && (
                <SectionCard title="Résumé des Alertes">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        <div className="p-4 bg-red-50 rounded-lg">
                            <div className="text-2xl font-bold text-red-600">
                                {expiredProducts?.length || 0}
                            </div>
                            <div className="text-sm text-red-800">Produits périmés</div>
                        </div>
                        <div className="p-4 bg-orange-50 rounded-lg">
                            <div className="text-2xl font-bold text-orange-600">
                                {expiringProducts?.length || 0}
                            </div>
                            <div className="text-sm text-orange-800">Proche péremption</div>
                        </div>
                        <div className="p-4 bg-yellow-50 rounded-lg">
                            <div className="text-2xl font-bold text-yellow-600">
                                {stockAlerts?.length || 0}
                            </div>
                            <div className="text-sm text-yellow-800">Stock faible</div>
                        </div>
                        <div className="p-4 bg-purple-50 rounded-lg">
                            <div className="text-2xl font-bold text-purple-600">
                                {menuBudgetAlerts?.length || 0}
                            </div>
                            <div className="text-sm text-purple-800">Budget dépassé</div>
                        </div>
                    </div>
                </SectionCard>
            )}
        </div>
    );
}
