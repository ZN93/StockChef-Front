import ProduitsList from "../../features/produits/ProduitsList";
import ProduitForm from "../../features/produits/ProduitForm";
import { SectionCard } from "../../ui/kit";

export default function ProduitsPage() {
    return (
        <div className="space-y-6">
            {/* Bloc principal : gestion des produits */}
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
        </div>
    );
}
