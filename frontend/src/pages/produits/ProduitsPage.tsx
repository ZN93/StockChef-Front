import ProduitsList from "../../features/produits/ProduitsList";
import ProduitForm from "../../features/produits/ProduitForm";
import { SectionCard } from "../../ui/kit";

export default function ProduitsPage() {
    return (
        <div className="space-y-6">
            {/* Bloc principal : gestion des produits */}
<<<<<<< Updated upstream
            <SectionCard
                title="Gestion des produits"
                actions={
                    <button
                        type="button"
                        className="px-3 py-2 rounded-xl border text-sm"
                    >
                        Importer
                    </button>
                }
            >
                <ProduitsList />
            </SectionCard>

            {/* Bloc secondaire : ajout d’un produit */}
            <SectionCard title="Ajouter un produit">
                <div className="max-w-xl">
                    <ProduitForm />
                </div>
            </SectionCard>
=======
            <div className="lg:col-span-2">
                <SectionCard
                    title="Gestion des produits"
                    actions={
                        <PermissionGuard permission="canManageInventory">
                            <button
                                type="button"
                                className="w-full sm:w-auto px-3 py-2 rounded-xl border text-sm"
                            >
                                Importer
                            </button>
                        </PermissionGuard>
                    }
                >
                    <ProduitsList/>
                </SectionCard>
            </div>

                {/* Bloc secondaire : ajout d'un produit - solo si puede gestionar inventario */}
            <PermissionGuard
                permission="canManageInventory"
                fallback={
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <p className="text-yellow-800 text-sm">
                            <strong>Mode lecture seule</strong> - Vous pouvez consulter les produits mais pas les
                            modifier.
                        </p>
                    </div>
                }
            >
                <div className="lg:col-span-2">
                    <SectionCard title="Ajouter un produit">
                        <div className="w-full">
                            <ProduitForm/>
                        </div>
                    </SectionCard>
                </div>
            </PermissionGuard>
>>>>>>> Stashed changes
        </div>
    );
}
