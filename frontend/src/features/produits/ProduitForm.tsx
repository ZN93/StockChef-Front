import { useState } from "react";
import { useCreateProduit } from "./api-real";
import type { NewProduit } from "./types";

export default function ProduitForm() {
    const [nom, setNom] = useState("");
    const [quantiteInitiale, setQuantiteInitiale] = useState<number | "">("");
    const [unite, setUnite] = useState<"KILOGRAMME" | "PIECE" | "LITRE" | "GRAMME">("PIECE");
    const [prixUnitaire, setPrixUnitaire] = useState<number | "">("");
    const [seuilAlerte, setSeuilAlerte] = useState<number | "">("");
    const [description, setDescription] = useState("");
    const [datePeremption, setDatePeremption] = useState<string>("");
    const [errors, setErrors] = useState<string[]>([]);
    const createProduit = useCreateProduit();

    function validate(): string[] {
        const errs: string[] = [];

        if (!nom.trim()) errs.push("Le nom est requis");
        if (!description.trim()) errs.push("La description est requise");

        const qRaw = quantiteInitiale;
        if (qRaw === "" || isNaN(Number(qRaw)) || Number(qRaw) < 0) {
            errs.push("La quantité doit être ≥ 0");
        }

        const sRaw = seuilAlerte;
        if (sRaw === "" || isNaN(Number(sRaw)) || Number(sRaw) < 0) {
            errs.push("Le seuil d'alerte doit être ≥ 0");
        }

        const pRaw = prixUnitaire;
        if (pRaw === "" || isNaN(Number(pRaw)) || Number(pRaw) < 0) {
            errs.push("Le prix doit être ≥ 0");
        }

        if (!datePeremption) {
            errs.push("La date de péremption est requise");
        }

        return errs;
    }

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        const errs = validate();
        setErrors(errs);
        if (errs.length > 0) return;

        const payload: NewProduit = {
            nom,
            quantiteInitiale: Number(quantiteInitiale),
            unite,
            prixUnitaire: Number(prixUnitaire),
            seuilAlerte: Number(seuilAlerte),
            description,
            datePeremption,
        };

        try {
            await createProduit.mutateAsync(payload);
            // Reset form
            setNom("");
            setQuantiteInitiale("");
            setUnite("PIECE");
            setPrixUnitaire("");
            setSeuilAlerte("");
            setDescription("");
            setDatePeremption("");
            setErrors([]);
        } catch (error) {
            console.error("Error creating product:", error);
            setErrors(["Erreur lors de la création"]);
        }
    }

    return (
        <form onSubmit={onSubmit} className="max-w-xl space-y-3">
            <h2 className="text-xl font-semibold">Ajouter un produit</h2>

            {errors.length > 0 && (
                <ul className="text-red-600 text-sm">
                    {errors.map((e: string, i: number) => <li key={i}>{e}</li>)}
                </ul>
            )}

            <label className="block">
                <span>Nom</span>
                <input value={nom} onChange={(e) => setNom(e.target.value)} className="border rounded px-2 py-1 w-full" />
            </label>

            <label className="block">
                <span>Description</span>
                <input value={description} onChange={(e) => setDescription(e.target.value)} className="border rounded px-2 py-1 w-full" />
            </label>

            <div className="grid grid-cols-2 gap-2">
                <label className="block">
                    <span>Quantité</span>
                    <input type="number" value={quantiteInitiale} onChange={(e) => setQuantiteInitiale(e.target.value === "" ? "" : Number(e.target.value))} className="border rounded px-2 py-1 w-full" />
                </label>
                <label className="block">
                    <span>Unité</span>
                    <select value={unite} onChange={(e) => setUnite(e.target.value as "KILOGRAMME" | "PIECE" | "LITRE" | "GRAMME")} className="border rounded px-2 py-1 w-full">
                        <option value="PIECE">Pièce</option>
                        <option value="KILOGRAMME">Kg</option>
                        <option value="LITRE">Litre</option>
                        <option value="GRAMME">Gramme</option>
                    </select>
                </label>
            </div>

            <div className="grid grid-cols-2 gap-2">
                <label className="block">
                    <span>Prix unitaire</span>
                    <input type="number" value={prixUnitaire} onChange={(e) => setPrixUnitaire(e.target.value === "" ? "" : Number(e.target.value))} className="border rounded px-2 py-1 w-full" />
                </label>
                <label className="block">
                    <span>Seuil d'alerte</span>
                    <input type="number" value={seuilAlerte} onChange={(e) => setSeuilAlerte(e.target.value === "" ? "" : Number(e.target.value))} className="border rounded px-2 py-1 w-full" />
                </label>
            </div>

            <label className="block">
                <span>Date de péremption</span>
                <input aria-label="Date de péremption" type="date" value={datePeremption} onChange={(e) => setDatePeremption(e.target.value)} className="border rounded px-2 py-1 w-full" />
            </label>

            <button type="submit" className="border px-3 py-1 rounded bg-black text-white disabled:opacity-50" disabled={createProduit.isPending}>
                {createProduit.isPending ? "Enregistrement..." : "Enregistrer"}
            </button>
        </form>
    );
}
