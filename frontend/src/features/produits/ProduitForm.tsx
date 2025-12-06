import { useState } from "react";
import { useCreateProduit } from "./api";
import type { NewProduit } from "./types";

export default function ProduitForm() {
    const [nom, setNom] = useState("");
    const [quantite, setQuantite] = useState<number | "">("");
    const [unite, setUnite] = useState("u");
    const [prixUnitaire, setPrixUnitaire] = useState<number | "">("");
    const [dateEntree, setDateEntree] = useState<string>("");        // ← string
    const [datePeremption, setDatePeremption] = useState<string>(""); // ← string
    const [errors, setErrors] = useState<string[]>([]);
    const createProduit = useCreateProduit();

    function validate(): string[] {
        const errs: string[] = [];

        if (!nom.trim()) errs.push("Le nom est requis");

        // ne pas convertir "" en 0 : traiter "" comme invalide
        const qRaw = quantite;
        if (qRaw === "" || isNaN(Number(qRaw)) || Number(qRaw) < 0) {
            errs.push("La quantité doit être ≥ 0");
        }

        const pRaw = prixUnitaire;
        if (pRaw === "" || isNaN(Number(pRaw)) || Number(pRaw) < 0) {
            errs.push("Le prix doit être ≥ 0");
        }

        if (dateEntree && datePeremption && new Date(datePeremption) <= new Date(dateEntree)) {
            errs.push("La date de péremption doit être après la date d'entrée");
        }

        return errs;
    }

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        const errs = validate();
        setErrors(errs);
        if (errs.length > 0) return;

        // construit un NewProduit (dates optionnelles)
        const payload: NewProduit = {
            nom,
            quantite: Number(quantite),
            unite,
            prixUnitaire: Number(prixUnitaire),
            ...(dateEntree ? { dateEntree } : {}),
            ...(datePeremption ? { datePeremption } : {}),
        };

        await createProduit.mutateAsync(payload);
    }

    return (
        <form onSubmit={onSubmit} className="max-w-xl space-y-3">
            <h2 className="text-xl font-semibold">Ajouter un produit</h2>

            {errors.length > 0 && (
                <ul className="text-red-600 text-sm">
                    {errors.map((e, i) => <li key={i}>{e}</li>)}
                </ul>
            )}

            <label className="block">
                <span>Nom</span>
                <input value={nom} onChange={(e) => setNom(e.target.value)} className="border rounded px-2 py-1 w-full" />
            </label>

            <div className="grid grid-cols-2 gap-2">
                <label className="block">
                    <span>Quantité</span>
                    <input type="number" value={quantite} onChange={(e) => setQuantite(e.target.value === "" ? "" : Number(e.target.value))} className="border rounded px-2 py-1 w-full" />
                </label>
                <label className="block">
                    <span>Unité</span>
                    <input value={unite} onChange={(e) => setUnite(e.target.value)} className="border rounded px-2 py-1 w-full" />
                </label>
            </div>

            <label className="block">
                <span>Prix unitaire</span>
                <input type="number" value={prixUnitaire} onChange={(e) => setPrixUnitaire(e.target.value === "" ? "" : Number(e.target.value))} className="border rounded px-2 py-1 w-full" />
            </label>

            <div className="grid grid-cols-2 gap-2">
                <label className="block">
                    <span>Date d'entrée</span>
                    <input aria-label="Date d'entrée" type="date" value={dateEntree} onChange={(e) => setDateEntree(e.target.value)} className="border rounded px-2 py-1 w-full" />
                </label>
                <label className="block">
                    <span>Date de péremption</span>
                    <input aria-label="Date de péremption" type="date" value={datePeremption} onChange={(e) => setDatePeremption(e.target.value)} className="border rounded px-2 py-1 w-full" />
                </label>
            </div>

            <button type="submit" className="border px-3 py-1 rounded bg-black text-white">Enregistrer</button>
        </form>
    );
}
