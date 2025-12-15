import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUserProfileApi, updateProfileApi, changePasswordApi } from "../auth/api";
import type { UpdateProfilePayload, ChangePasswordPayload } from "../auth/api";
import { useAuth } from "../auth/useAuth";

export default function Profile() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const queryClient = useQueryClient();
    
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [error, setError] = useState<string>("");
    const [success, setSuccess] = useState<string>("");
    const [profileForm, setProfileForm] = useState({
        firstName: "",
        lastName: "",
        email: ""
    });

    const [passwordForm, setPasswordForm] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    const { data: profile, isLoading, error: profileError } = useQuery({
        queryKey: ["userProfile"],
        queryFn: getUserProfileApi,
        enabled: !!user
    });

    const updateProfileMutation = useMutation({
        mutationFn: (data: UpdateProfilePayload) => updateProfileApi(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["userProfile"] });
            setIsEditingProfile(false);
            setSuccess("Profil mis à jour avec succès");
            setError("");
        },
        onError: (error: unknown) => {
            const message = error && typeof error === 'object' && 'response' in error && 
                            error.response && typeof error.response === 'object' && 'data' in error.response &&
                            error.response.data && typeof error.response.data === 'object' && 'message' in error.response.data
                            ? String(error.response.data.message)
                            : "Erreur lors de la mise à jour du profil";
            setError(message);
            setSuccess("");
        }
    });

    const changePasswordMutation = useMutation({
        mutationFn: (data: ChangePasswordPayload) => changePasswordApi(data),
        onSuccess: () => {
            setIsChangingPassword(false);
            setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
            setSuccess("Mot de passe changé avec succès");
            setError("");
        },
        onError: (error: unknown) => {
            const message = error && typeof error === 'object' && 'response' in error && 
                            error.response && typeof error.response === 'object' && 'data' in error.response &&
                            error.response.data && typeof error.response.data === 'object' && 'message' in error.response.data
                            ? String(error.response.data.message)
                            : "Erreur lors du changement de mot de passe";
            setError(message);
            setSuccess("");
        }
    });

    useEffect(() => {
        if (profile) {
            setProfileForm({
                firstName: profile.firstName,
                lastName: profile.lastName,
                email: profile.email
            });
        }
    }, [profile]);
    
    const handleProfileSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        
        if (!profileForm.firstName || !profileForm.lastName || !profileForm.email) {
            setError("Tous les champs sont requis");
            return;
        }
        
        updateProfileMutation.mutate(profileForm);
    };
    
    const handlePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        
        if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
            setError("Tous les champs de mot de passe sont requis");
            return;
        }
        
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            setError("Les mots de passe ne correspondent pas");
            return;
        }
        
        if (passwordForm.newPassword.length < 6) {
            setError("Le mot de passe doit contenir au moins 6 caractères");
            return;
        }
        
        changePasswordMutation.mutate({
            currentPassword: passwordForm.currentPassword,
            newPassword: passwordForm.newPassword
        });
    };
    
    const getRoleDisplayName = (role: string) => {
        switch (role) {
            case "ROLE_DEVELOPER": return "Développeur";
            case "ROLE_ADMIN": return "Administrateur";
            case "ROLE_CHEF": return "Chef de cuisine";
            case "ROLE_EMPLOYEE": return "Employé";
            default: return role;
        }
    };
    
    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case "ROLE_DEVELOPER": return "bg-purple-100 text-purple-800";
            case "ROLE_ADMIN": return "bg-red-100 text-red-800";
            case "ROLE_CHEF": return "bg-orange-100 text-orange-800";
            case "ROLE_EMPLOYEE": return "bg-blue-100 text-blue-800";
            default: return "bg-gray-100 text-gray-800";
        }
    };
    
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Chargement du profil...</p>
                </div>
            </div>
        );
    }
    
    if (profileError || !profile) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="max-w-md w-full space-y-8">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-gray-900">Erreur</h2>
                        <p className="mt-2 text-gray-600">Impossible de charger le profil</p>
                        <button
                            onClick={() => navigate("/app")}
                            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            Retour au tableau de bord
                        </button>
                    </div>
                </div>
            </div>
        );
    }
    
    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-lg shadow">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Mon Profil</h1>
                                <p className="text-gray-600">Gérez vos informations personnelles</p>
                            </div>
                            <button
                                onClick={() => navigate("/app")}
                                className="px-4 py-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                Retour
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-red-600">{error}</p>
                        </div>
                    )}
                    
                    {success && (
                        <div className="mx-6 mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                            <p className="text-green-600">{success}</p>
                        </div>
                    )}
                    
                    <div className="p-6 space-y-8">
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold text-gray-900">Informations personnelles</h2>
                                {!isEditingProfile && (
                                    <button
                                        onClick={() => setIsEditingProfile(true)}
                                        className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                                    >
                                        Modifier
                                    </button>
                                )}
                            </div>
                            
                            {!isEditingProfile ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Prénom</label>
                                        <p className="mt-1 text-gray-900">{profile.firstName}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Nom</label>
                                        <p className="mt-1 text-gray-900">{profile.lastName}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Email</label>
                                        <p className="mt-1 text-gray-900">{profile.email}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Rôle</label>
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(profile.role)}`}>
                                            {getRoleDisplayName(profile.role)}
                                        </span>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Membre depuis</label>
                                        <p className="mt-1 text-gray-900">
                                            {new Date(profile.createdAt).toLocaleDateString("fr-FR", {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric"
                                            })}
                                        </p>
                                    </div>
                                    {profile.lastLoginAt && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Dernière connexion</label>
                                            <p className="mt-1 text-gray-900">
                                                {new Date(profile.lastLoginAt).toLocaleDateString("fr-FR", {
                                                    year: "numeric",
                                                    month: "long",
                                                    day: "numeric",
                                                    hour: "2-digit",
                                                    minute: "2-digit"
                                                })}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <form onSubmit={handleProfileSubmit} className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Prénom</label>
                                            <input
                                                type="text"
                                                value={profileForm.firstName}
                                                onChange={(e) => setProfileForm({...profileForm, firstName: e.target.value})}
                                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Nom</label>
                                            <input
                                                type="text"
                                                value={profileForm.lastName}
                                                onChange={(e) => setProfileForm({...profileForm, lastName: e.target.value})}
                                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Email</label>
                                        <input
                                            type="email"
                                            value={profileForm.email}
                                            onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                            required
                                        />
                                    </div>
                                    <div className="flex space-x-3">
                                        <button
                                            type="submit"
                                            disabled={updateProfileMutation.isPending}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                                        >
                                            {updateProfileMutation.isPending ? "Enregistrement..." : "Enregistrer"}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setIsEditingProfile(false);
                                                setProfileForm({
                                                    firstName: profile.firstName,
                                                    lastName: profile.lastName,
                                                    email: profile.email
                                                });
                                            }}
                                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                                        >
                                            Annuler
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>

                        <div className="border-t pt-8">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold text-gray-900">Sécurité</h2>
                                {!isChangingPassword && (
                                    <button
                                        onClick={() => setIsChangingPassword(true)}
                                        className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                                    >
                                        Changer le mot de passe
                                    </button>
                                )}
                            </div>
                            
                            {isChangingPassword && (
                                <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-md">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Mot de passe actuel</label>
                                        <input
                                            type="password"
                                            value={passwordForm.currentPassword}
                                            onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Nouveau mot de passe</label>
                                        <input
                                            type="password"
                                            value={passwordForm.newPassword}
                                            onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                            required
                                            minLength={6}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Confirmer le nouveau mot de passe</label>
                                        <input
                                            type="password"
                                            value={passwordForm.confirmPassword}
                                            onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                            required
                                            minLength={6}
                                        />
                                    </div>
                                    <div className="flex space-x-3">
                                        <button
                                            type="submit"
                                            disabled={changePasswordMutation.isPending}
                                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                                        >
                                            {changePasswordMutation.isPending ? "Modification..." : "Modifier"}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setIsChangingPassword(false);
                                                setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
                                            }}
                                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                                        >
                                            Annuler
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}