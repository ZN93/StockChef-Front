import SectionCard from "../ui/SectionCard.tsx";
import { Chip} from "../ui/Chip.tsx";

export default function AlertesPage() {
    return (
<<<<<<< Updated upstream
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 p-4">

            {/* ------------------ Péremption & Stock ------------------ */}
            <SectionCard title="Péremption & stock">
                <ul className="space-y-3 text-sm">
                    {/* Produit périmé */}
                    <li className="flex items-start gap-3">
                        <Chip type="danger">Périmé</Chip>
                        <div>
                            <div className="font-medium">Beurre — 5 kg</div>
                            <div className="text-gray-500">
                                Périmé aujourd'hui. Retirer des menus.
                            </div>
=======
        <div className="space-y-6 px-3 py-4 md:px-6 md:py-6">
            {isLoading && (
                <div className="text-center py-8">
                    <div
                        className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"></div>
                    <div className="text-gray-600">Chargement des alertes...</div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <SectionCard title="Péremption & Stock">
                    <div className="space-y-4">
                        {expiredProducts && expiredProducts.length > 0 && (
                            <div>
                                <h4 className="font-medium text-red-600 mb-2">Produits périmés</h4>
                                <ul className="space-y-3 text-sm">
                                    {expiredProducts.map((product) => (
                                        <li key={product.id} className="flex items-start gap-3">
                                            <div className="shrink-0">
                                                <Chip type="danger">Périmé</Chip>
                                            </div>
                                            <div className="min-w-0">
                                                <div>
                                                    <div className="font-medium break-words">
                                                        {product.nom} — {product.quantiteStock} {product.unite}
                                                    </div>
                                                    <div className="text-gray-500 break-words">
                                                        Périmé le {formatDate(product.datePeremption)}. Retirer du
                                                        stock.
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                        ))}
                                </ul>
                            </div>
                        )}
                        {expiringProducts && expiringProducts.length > 0 && (
                            <div>
                                <h4 className="font-medium text-orange-600 mb-2">Proche péremption</h4>
                                <ul className="space-y-3 text-sm">
                                    {expiringProducts.map((product) => {
                                        const daysLeft = getDaysUntilExpiry(product.datePeremption);
                                        return (
                                            <li key={product.id} className="flex items-start gap-3">
                                                <div className="shrink-0">
                                                    <Chip type="warn">
                                                        {daysLeft <= 0 ? "Expire" : `${daysLeft}j`}
                                                    </Chip>
                                                </div>
                                                <div className="min-w-0">
                                                    <div>
                                                        <div className="font-medium break-words">
                                                            {product.nom} — {product.quantiteStock} {product.unite}
                                                        </div>
                                                        <div className="text-gray-500 break-words">
                                                            {daysLeft <= 0
                                                                ? "Expire aujourd'hui"
                                                                : `Expire dans ${daysLeft} jour${daysLeft > 1 ? 's' : ''}`
                                                            }. Prioriser.
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                    );
                                    })}
                                </ul>
                            </div>
                        )}
                        {stockAlerts && stockAlerts.length > 0 && (
                            <div>
                                <h4 className="font-medium text-yellow-600 mb-2">Stock faible</h4>
                                <ul className="space-y-3 text-sm">
                                    {stockAlerts.map((product) => (
                                        <li key={product.id} className="flex items-start gap-3">
                                            <div className="shrink-0">
                                                <Chip type="warn">Stock ↓</Chip>
                                            </div>
                                            <div className="min-w-0">
                                                <div>
                                                    <div className="font-medium break-words">
                                                        {product.nom} — {product.quantiteStock} {product.unite}
                                                    </div>
                                                    <div className="text-gray-500 break-words">
                                                        Stock sous le seuil de {product.seuil} {product.unite}.
                                                        Réapprovisionner.
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        {!isLoading &&
                            (!expiredProducts?.length && !expiringProducts?.length && !stockAlerts?.length) && (
                                <div className="text-center py-8 text-gray-500">
                                    <div className="text-green-600 text-lg mb-2">✅ Aucune alerte</div>
                                    <div>Tous les produits sont en bon état</div>
                                </div>
                            )}
                    </div>
                </SectionCard>
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
                                                <div className="shrink-0">
                                                    <Chip type="warn">
                                                        {isOverBudget ? "Budget" : "Marge"}
                                                    </Chip>
                                                </div>
                                                <div className="min-w-0">
                                                    <div>
                                                        <div className="font-medium break-words">{menu.nom}</div>
                                                        <div className="text-gray-500 break-words">
                                                            {isOverBudget && (
                                                                <>Coût {formatCurrency(cout)} &gt; seuil {formatCurrency(SEUIL_BUDGET)}</>
                                                            )}
                                                            {hasLowMargin && !isOverBudget && (
                                                                <>Marge faible: coût {formatCurrency(cout)} /
                                                                    prix {formatCurrency(prix)}</>
                                                            )}
                                                        </div>
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
            {!isLoading && (
                <SectionCard title="Résumé des Alertes">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-center">
                        <div className="p-4 bg-red-50 rounded-lg">
                            <div className="text-2xl font-bold text-red-600">
                                {expiredProducts?.length || 0}
                            </div>
                            <div className="text-sm text-red-800">Produits périmés</div>
>>>>>>> Stashed changes
                        </div>
                    </li>

                    {/* Produit proche péremption */}
                    <li className="flex items-start gap-3">
                        <Chip type="warn">Proche</Chip>
                        <div>
                            <div className="font-medium">Lait UHT — 10 L</div>
                            <div className="text-gray-500">
                                Péremption &lt; 3 jours. Prioriser.
                            </div>
                        </div>
                    </li>
                </ul>
            </SectionCard>

            {/* ------------------ Dépassements de budget ------------------ */}
            <SectionCard title="Budget menus">
                <ul className="space-y-3 text-sm">
                    <li className="flex items-start gap-3">
                        <Chip type="warn">Dépassement</Chip>
                        <div>
                            <div className="font-medium">Repas Luxueux</div>
                            <div className="text-gray-500">
                                Coût 5,50 € &gt; seuil 4,50 €
                            </div>
                        </div>
                    </li>
                </ul>
            </SectionCard>

        </div>
    );
}
