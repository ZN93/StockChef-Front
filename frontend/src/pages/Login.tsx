import { type FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState("developer@stockchef.com");
    const [password, setPassword] = useState("devpass123");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            await login(email, password);
            navigate("/app", { replace: true });
        } catch (err: any) {
            console.error(err);
            setError("Identifiants invalides ou erreur serveur");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <form
                onSubmit={handleSubmit}
                className="bg-white rounded-2xl shadow-md p-6 w-full max-w-sm space-y-4"
            >
                <h1 className="text-xl font-semibold text-center">Connexion</h1>

                <div className="space-y-1">
                    <label className="text-sm text-gray-600">Email</label>
                    <input
                        type="email"
                        className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div className="space-y-1">
                    <label className="text-sm text-gray-600">Mot de passe</label>
                    <input
                        type="password"
                        className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                {error && (
                    <div className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded-xl">
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-black text-white rounded-xl py-2 mt-2 disabled:opacity-60"
                >
                    {loading ? "Connexion..." : "Se connecter"}
                </button>

                <div className="text-center">
                    <button
                        type="button"
                        onClick={() => navigate("/register")}
                        className="text-sm text-gray-600 hover:text-gray-800"
                    >
                        Pas de compte ? Créer un compte
                    </button>
                </div>
            </form>
        </div>
    );
}
