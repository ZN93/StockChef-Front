import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
    const { login } = useAuth();
    const nav = useNavigate();
    const go = (role: "USER"|"ADMIN") => { login(role); nav("/app"); };

    return (
        <div className="min-h-screen grid place-items-center">
            <div className="border rounded-xl p-6 space-y-3 w-80">
                <h1 className="text-lg font-semibold">Connexion</h1>
                <button className="w-full border rounded p-2" onClick={() => go("USER")}>Continuer en Utilisateur</button>
                <button className="w-full border rounded p-2" onClick={() => go("ADMIN")}>Continuer en Administrateur</button>
            </div>
        </div>
    );
}
