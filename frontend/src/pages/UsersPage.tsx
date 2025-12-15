import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../api/client";
import { PermissionGuard } from "../components/RoleGuard";
import { useAuth } from "../auth/AuthContext";

// Types for user management
interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    fullName: string;
    role: string;
    effectiveRole: string;
    isActive: boolean;
    createdAt: string;
    lastLoginAt?: string;
}

interface CreateUserPayload {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

interface UpdateUserPayload {
    firstName: string;
    lastName: string;
    email: string;
}

interface UpdateRolePayload {
    newRole: string;
}

// API functions
const getUsersApi = async (): Promise<User[]> => {
    const response = await apiClient.get("/admin/users");
    return response.data;
};

const createUserApi = async (payload: CreateUserPayload): Promise<User> => {
    const response = await apiClient.post("/users/register", payload);
    return response.data;
};

const updateUserApi = async (id: string, payload: UpdateUserPayload): Promise<User> => {
    const response = await apiClient.put(`/users/${id}`, payload);
    return response.data;
};

const updateUserRoleApi = async (id: string, payload: UpdateRolePayload): Promise<User> => {
    const response = await apiClient.put(`/admin/users/${id}/role`, payload);
    return response.data;
};

const deleteUserApi = async (id: string): Promise<void> => {
    await apiClient.delete(`/users/${id}`);
};

const resetPasswordApi = async (id: string): Promise<void> => {
    await apiClient.post(`/users/${id}/reset-password`);
};

export default function UsersPage() {
    const { auth } = useAuth();
    const queryClient = useQueryClient();
    const [isCreating, setIsCreating] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [error, setError] = useState<string>("");
    const [success, setSuccess] = useState<string>("");
    
    // Form states
    const [createForm, setCreateForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: ""
    });
    
    const [editForm, setEditForm] = useState({
        firstName: "",
        lastName: "",
        email: ""
    });
    
    // Get users query
    const { data: users = [], isLoading, error: usersError } = useQuery({
        queryKey: ["users"],
        queryFn: getUsersApi
    });
    
    // Mutations
    const createUserMutation = useMutation({
        mutationFn: createUserApi,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
            setIsCreating(false);
            setCreateForm({ firstName: "", lastName: "", email: "", password: "" });
            setSuccess("Usuario creado con éxito");
            setError("");
        },
        onError: (error: unknown) => {
            const message = error && typeof error === 'object' && 'response' in error && 
                            error.response && typeof error.response === 'object' && 'data' in error.response &&
                            error.response.data && typeof error.response.data === 'object' && 'message' in error.response.data
                            ? String(error.response.data.message)
                            : "Error al crear el usuario";
            setError(message);
            setSuccess("");
        }
    });
    
    const updateUserMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateUserPayload }) => updateUserApi(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
            setEditingUser(null);
            setSuccess("Usuario actualizado con éxito");
            setError("");
        },
        onError: (error: unknown) => {
            const message = error && typeof error === 'object' && 'response' in error && 
                            error.response && typeof error.response === 'object' && 'data' in error.response &&
                            error.response.data && typeof error.response.data === 'object' && 'message' in error.response.data
                            ? String(error.response.data.message)
                            : "Error al actualizar el usuario";
            setError(message);
            setSuccess("");
        }
    });
    
    const deleteUserMutation = useMutation({
        mutationFn: deleteUserApi,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
            setSuccess("Usuario eliminado con éxito");
            setError("");
        },
        onError: (error: unknown) => {
            const message = error && typeof error === 'object' && 'response' in error && 
                            error.response && typeof error.response === 'object' && 'data' in error.response &&
                            error.response.data && typeof error.response.data === 'object' && 'message' in error.response.data
                            ? String(error.response.data.message)
                            : "Error al eliminar el usuario";
            setError(message);
            setSuccess("");
        }
    });
    
    const updateRoleMutation = useMutation({
        mutationFn: ({ id, newRole }: { id: string; newRole: string }) => updateUserRoleApi(id, { newRole }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
            setSuccess("Rol actualizado con éxito");
            setError("");
        },
        onError: (error: unknown) => {
            const message = error && typeof error === 'object' && 'response' in error && 
                            error.response && typeof error.response === 'object' && 'data' in error.response &&
                            error.response.data && typeof error.response.data === 'object' && 'message' in error.response.data
                            ? String(error.response.data.message)
                            : "Error al actualizar el rol";
            setError(message);
            setSuccess("");
        }
    });
    
    const resetPasswordMutation = useMutation({
        mutationFn: resetPasswordApi,
        onSuccess: () => {
            setSuccess("Contraseña restablecida con éxito");
            setError("");
        },
        onError: (error: unknown) => {
            const message = error && typeof error === 'object' && 'response' in error && 
                            error.response && typeof error.response === 'object' && 'data' in error.response &&
                            error.response.data && typeof error.response.data === 'object' && 'message' in error.response.data
                            ? String(error.response.data.message)
                            : "Error al restablecer la contraseña";
            setError(message);
            setSuccess("");
        }
    });
    
    const handleCreateSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        
        if (!createForm.firstName || !createForm.lastName || !createForm.email || !createForm.password) {
            setError("Todos los campos son requeridos");
            return;
        }
        
        if (createForm.password.length < 6) {
            setError("La contraseña debe tener al menos 6 caracteres");
            return;
        }
        
        createUserMutation.mutate(createForm);
    };
    
    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingUser) return;
        
        setError("");
        setSuccess("");
        
        if (!editForm.firstName || !editForm.lastName || !editForm.email) {
            setError("Todos los campos son requeridos");
            return;
        }
        
        updateUserMutation.mutate({ id: editingUser.id, data: editForm });
    };
    
    const handleEditUser = (user: User) => {
        setEditingUser(user);
        setEditForm({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email
        });
    };
    
    const handleDeleteUser = (user: User) => {
        if (window.confirm(`¿Estás seguro de que quieres eliminar al usuario ${user.fullName}?`)) {
            deleteUserMutation.mutate(user.id);
        }
    };
    
    const handleResetPassword = (user: User) => {
        if (window.confirm(`¿Restablecer la contraseña de ${user.fullName}?`)) {
            resetPasswordMutation.mutate(user.id);
        }
    };
    
    const handleRoleChange = (userId: string, newRole: string) => {
        updateRoleMutation.mutate({ id: userId, newRole: newRole });
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
    
    return (
        <PermissionGuard permission="canManageUsers" fallback={
            <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Accès refusé</h2>
                <p className="text-gray-600">Vous n'avez pas les permissions pour gérer les utilisateurs</p>
            </div>
        }>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Gestion des utilisateurs</h1>
                        <p className="text-gray-600">Gérer les comptes utilisateur et les permissions</p>
                        <div className="text-sm text-blue-600 mt-1">
                            Connecté en tant que: {auth.role} | Token: {auth.token ? 'Présent' : 'Absent'}
                        </div>
                    </div>
                    <button
                        onClick={() => setIsCreating(true)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Nouveau utilisateur
                    </button>
                </div>
                
                {/* Alerts */}
                {error && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-600">{error}</p>
                    </div>
                )}
                
                {success && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-green-600">{success}</p>
                    </div>
                )}
                
                {/* Create User Modal */}
                {isCreating && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 w-full max-w-md">
                            <h2 className="text-lg font-semibold mb-4">Crear nuevo usuario</h2>
                            <form onSubmit={handleCreateSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Prénom</label>
                                    <input
                                        type="text"
                                        value={createForm.firstName}
                                        onChange={(e) => setCreateForm({...createForm, firstName: e.target.value})}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Nom</label>
                                    <input
                                        type="text"
                                        value={createForm.lastName}
                                        onChange={(e) => setCreateForm({...createForm, lastName: e.target.value})}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Email</label>
                                    <input
                                        type="email"
                                        value={createForm.email}
                                        onChange={(e) => setCreateForm({...createForm, email: e.target.value})}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Contraseña</label>
                                    <input
                                        type="password"
                                        value={createForm.password}
                                        onChange={(e) => setCreateForm({...createForm, password: e.target.value})}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        required
                                        minLength={6}
                                    />
                                </div>
                                <div className="flex space-x-3">
                                    <button
                                        type="submit"
                                        disabled={createUserMutation.isPending}
                                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                                    >
                                        {createUserMutation.isPending ? "Creando..." : "Crear"}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setIsCreating(false)}
                                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
                
                {/* Edit User Modal */}
                {editingUser && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 w-full max-w-md">
                            <h2 className="text-lg font-semibold mb-4">Editar usuario</h2>
                            <form onSubmit={handleEditSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Prénom</label>
                                    <input
                                        type="text"
                                        value={editForm.firstName}
                                        onChange={(e) => setEditForm({...editForm, firstName: e.target.value})}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Nom</label>
                                    <input
                                        type="text"
                                        value={editForm.lastName}
                                        onChange={(e) => setEditForm({...editForm, lastName: e.target.value})}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Email</label>
                                    <input
                                        type="email"
                                        value={editForm.email}
                                        onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                </div>
                                <div className="flex space-x-3">
                                    <button
                                        type="submit"
                                        disabled={updateUserMutation.isPending}
                                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                                    >
                                        {updateUserMutation.isPending ? "Guardando..." : "Guardar"}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setEditingUser(null)}
                                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
                
                {/* Users List */}
                {isLoading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Cargando usuarios...</p>
                    </div>
                ) : usersError ? (
                    <div className="text-center py-12">
                        <p className="text-red-600">Error al cargar los usuarios</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Usuario
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Email
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Rol
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Estado
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {users.map((user) => (
                                    <tr key={user.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">
                                                    {user.fullName}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    Créé le {new Date(user.createdAt).toLocaleDateString("fr-FR")}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {user.email}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <select
                                                value={user.role}
                                                onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                                className={`text-xs rounded-full px-2 py-1 ${getRoleBadgeColor(user.role)} border-0 focus:ring-2 focus:ring-blue-500`}
                                            >
                                                <option value="ROLE_EMPLOYEE">Employé</option>
                                                <option value="ROLE_CHEF">Chef de cuisine</option>
                                                <option value="ROLE_ADMIN">Administrateur</option>
                                                <option value="ROLE_DEVELOPER">Développeur</option>
                                            </select>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex px-2 py-1 text-xs rounded-full ${user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                {user.isActive ? 'Actif' : 'Inactif'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => handleEditUser(user)}
                                                    className="text-blue-600 hover:text-blue-900"
                                                >
                                                    Éditer
                                                </button>
                                                <button
                                                    onClick={() => handleResetPassword(user)}
                                                    className="text-green-600 hover:text-green-900"
                                                >
                                                    Reset pwd
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteUser(user)}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    Supprimer
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </PermissionGuard>
    );
}