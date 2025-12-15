import { type FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerApi, type RegisterPayload } from "../auth/api";

export default function RegisterPage() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState<RegisterPayload>({
        firstName: "",
        lastName: "",
        email: "",
        password: ""
    });
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    function handleChange(field: keyof RegisterPayload, value: string) {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    }

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        // Validation
        if (!formData.firstName.trim()) {
            setError("Le prénom est requis");
            return;
        }
        if (!formData.lastName.trim()) {
            setError("Le nom de famille est requis");
            return;
        }
        if (!formData.email.trim()) {
            setError("L'email est requis");
            return;
        }
        if (!formData.password) {
            setError("Le mot de passe est requis");
            return;
        }
        if (formData.password !== confirmPassword) {
            setError("Les mots de passe ne correspondent pas");
            return;
        }
        if (formData.password.length < 6) {
            setError("Le mot de passe doit contenir au moins 6 caractères");
            return;
        }

        setLoading(true);
        try {
            await registerApi(formData);
            setSuccess("Compte créé avec succès ! Vous allez être redirigé vers la page de connexion...");
            
            // Redirect to login after 2 seconds
            setTimeout(() => {
                navigate("/login", { replace: true });
            }, 2000);
        } catch (err: unknown) {
            console.error("Erreur lors de l'inscription:", err);
            
            // Handle specific error messages
            const error = err as { response?: { status?: number } }; // Type for axios error
            if (error.response?.status === 409) {
                setError("Un compte avec cet email existe déjà");
            } else if (error.response?.status === 400) {
                setError("Données invalides. Vérifiez vos informations.");
            } else {
                setError("Erreur lors de la création du compte. Veuillez réessayer.");
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <form
                onSubmit={handleSubmit}
                className="bg-white rounded-2xl shadow-md p-6 w-full max-w-md space-y-4"
            >
                <h1 className="text-xl font-semibold text-center">Créer un compte</h1>

                <div className="space-y-1">
                    <label className="text-sm text-gray-600">Prénom</label>
                    <input
                        type="text"
                        className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring"
                        value={formData.firstName}
                        onChange={(e) => handleChange("firstName", e.target.value)}
                        placeholder="Votre prénom"
                    />
                </div>

                <div className="space-y-1">
                    <label className="text-sm text-gray-600">Nom de famille</label>
                    <input
                        type="text"
                        className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring"
                        value={formData.lastName}
                        onChange={(e) => handleChange("lastName", e.target.value)}
                        placeholder="Votre nom de famille"
                    />
                </div>

                <div className="space-y-1">
                    <label className="text-sm text-gray-600">Email</label>
                    <input
                        type="email"
                        className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring"
                        value={formData.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        placeholder="votre@email.com"
                    />
                </div>

                <div className="space-y-1">
                    <label className="text-sm text-gray-600">Mot de passe</label>
                    <input
                        type="password"
                        className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring"
                        value={formData.password}
                        onChange={(e) => handleChange("password", e.target.value)}
                        placeholder="Au moins 6 caractères"
                    />
                </div>

                <div className="space-y-1">
                    <label className="text-sm text-gray-600">Confirmer le mot de passe</label>
                    <input
                        type="password"
                        className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Retapez votre mot de passe"
                    />
                </div>

                {error && (
                    <div className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded-xl">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="text-xs text-green-600 bg-green-50 px-3 py-2 rounded-xl">
                        {success}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-black text-white rounded-xl py-2 mt-2 disabled:opacity-60"
                >
                    {loading ? "Création..." : "Créer le compte"}
                </button>

                <div className="text-center">
                    <button
                        type="button"
                        onClick={() => navigate("/login")}
                        className="text-sm text-gray-600 hover:text-gray-800"
                    >
                        Déjà un compte ? Se connecter
                    </button>
                </div>
            </form>
        </div>
    );
}