import SectionCard from "../ui/SectionCard.tsx";
import { Chip} from "../ui/Chip.tsx";

export default function AlertesPage() {
    return (
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
