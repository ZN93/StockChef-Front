import ProduitsList from "../../features/produits/ProduitsList";
import ProduitForm from "../../features/produits/ProduitForm";
import { SectionCard } from "../../ui/kit";
import { PermissionGuard } from "../../components/RoleGuard";

export default function ProduitsPage() {
    return (
        <div className="space-y-6">
            {/* Bloc principal : gestion des produits */}
            <SectionCard
                title="Gestion des produits"
                actions={
                    <PermissionGuard permission="canManageInventory">
                        <button
                            type="button"
                            className="px-3 py-2 rounded-xl border text-sm"
                        >
                            Importer
                        </button>
                    </PermissionGuard>
                }
            >
                <ProduitsList />
            </SectionCard>

            {/* Bloc secondaire : ajout d'un produit - solo si puede gestionar inventario */}
            <PermissionGuard 
                permission="canManageInventory"
                fallback={
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <p className="text-yellow-800 text-sm">
                            <strong>Mode lecture seule</strong> - Vous pouvez consulter les produits mais pas les modifier.
                        </p>
                    </div>
                }
            >
                <SectionCard title="Ajouter un produit">
                    <div className="max-w-xl">
                        <ProduitForm />
                    </div>
                </SectionCard>
            </PermissionGuard>
        </div>
    );
}
