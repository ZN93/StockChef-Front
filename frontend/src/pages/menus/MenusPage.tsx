import MenuForm from "../../features/menus/MenuForm";
import MenuList from "../../features/menus/MenuList";
import { SectionCard, Chip } from "../../ui/kit";

export default function MenusPage() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
<<<<<<< Updated upstream
=======
            <div className="md:col-span-2 space-y-6">
            <SectionCard
                    title="Menus récents"
                    actions={<Chip type="success">Auto-MAJ</Chip>}
                >
                    <MenuList />
                </SectionCard>
            </div>
>>>>>>> Stashed changes

            {/* --- Colonne gauche : Formulaire de création --- */}
            <div className="md:col-span-1">
                <SectionCard
                    title="Créer un menu"
                    actions={<Chip type="info">Formulaire</Chip>}
                >
                    <MenuForm />
                </SectionCard>
            </div>

            {/* --- Colonne droite : Liste des menus existants --- */}
            <div className="md:col-span-2 space-y-6">
                <SectionCard
                    title="Menus récents"
                    actions={<Chip type="success">Auto-MAJ</Chip>}
                >
                    <MenuList />
                </SectionCard>
            </div>
        </div>
    );
}
