import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../api/client';
import type { Produit, NewProduit, InventorySummary, ConsommerProduitRequest, EditProduitRequest } from './types';

// Hook principal pour obtenir les produits du backend réel
export const useProduitsReal = () => {
  return useQuery({
    queryKey: ['produits', 'real'],
    queryFn: async (): Promise<Produit[]> => {
      console.log('🔍 useProduits: Récupération des produits du backend réel...');
      try {
        const response = await apiClient.get<Produit[]>('/inventory/produits');
        console.log('✅ Produits récupérés:', response.data.length);
        return response.data;
      } catch (error) {
        console.error('❌ Erreur lors de la récupération des produits:', error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

// Hook pour rechercher des produits
export const useProduitsSearch = (query: string) => {
  return useQuery({
    queryKey: ['produits', 'search', query, 'real'],
    queryFn: async (): Promise<Produit[]> => {
      if (query.trim().length === 0) return [];
      
      console.log('🔍 Recherche de produits:', query);
      const response = await apiClient.get<Produit[]>(`/inventory/produits/search?query=${encodeURIComponent(query)}`);
      return response.data;
    },
    enabled: query.trim().length > 0, // Exécuter seulement si il y a une requête
    staleTime: 2 * 60 * 1000, // 2 minutes pour les recherches
  });
};

// Hook pour obtenir le résumé de l'inventaire
export const useInventorySummary = () => {
  return useQuery({
    queryKey: ['inventory', 'summary', 'real'],
    queryFn: async (): Promise<InventorySummary> => {
      console.log('📊 Récupération du résumé de l\'inventaire...');
      const response = await apiClient.get<InventorySummary>('/inventory/summary');
      return response.data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutos
  });
};

// Hook pour créer des produits
export const useCreateProduit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (produit: NewProduit): Promise<Produit> => {
      console.log('➕ Création du produit:', produit.nom);
      const response = await apiClient.post<Produit>('/inventory/produits', produit);
      return response.data;
    },
    onSuccess: () => {
      // Invalider les requêtes associées
      queryClient.invalidateQueries({ queryKey: ['produits'] });
      queryClient.invalidateQueries({ queryKey: ['inventory', 'summary'] });
      console.log('✅ Produit créé et cache mis à jour');
    },
    onError: (error) => {
      console.error('❌ Erreur lors de la création du produit:', error);
    }
  });
};

// Hook pour consommer des produits
export const useConsommerProduit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: ConsommerProduitRequest }): Promise<Produit> => {
      console.log(`🍽️ Sortie de stock produit ID ${id}:`, data.quantite, 'motif:', data.motif);
      const response = await apiClient.post<Produit>(`/inventory/produits/${id}/sortie`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['produits'] });
      queryClient.invalidateQueries({ queryKey: ['inventory', 'summary'] });
      console.log('✅ Sortie de stock effectuée et cache mis à jour');
    },
    onError: (error) => {
      console.error('❌ Error en sortie de stock:', error);
    }
  });
};

// Hooks additionnels disponibles dans le backend
export const useProduitsAlerts = () => {
  return useQuery({
    queryKey: ['produits', 'alerts', 'real'],
    queryFn: async (): Promise<Produit[]> => {
      console.log('🚨 Récupération des produits en alerte...');
      const response = await apiClient.get<Produit[]>('/inventory/produits/alerts');
      return response.data;
    },
  });
};

export const useProduitsExpiring = () => {
  return useQuery({
    queryKey: ['produits', 'expiring', 'real'],
    queryFn: async (): Promise<Produit[]> => {
      console.log('⏰ Récupération des produits proche de l\'expiration...');
      const response = await apiClient.get<Produit[]>('/inventory/produits/expiring');
      return response.data;
    },
  });
};

// Hook pour éditer des produits
export const useEditProduit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: EditProduitRequest }): Promise<Produit> => {
      console.log(`✏️ Édition du produit ID ${id}:`, data);
      const response = await apiClient.put<Produit>(`/inventory/produits/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['produits'] });
      queryClient.invalidateQueries({ queryKey: ['inventory', 'summary'] });
      console.log('✅ Produit édité et cache mis à jour');
    },
    onError: (error) => {
      console.error('❌ Erreur lors de l\'édition du produit:', error);
    }
  });
};

// Hook pour supprimer des produits (soft delete)
export const useDeleteProduit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number): Promise<void> => {
      console.log(`🗑️ Suppression du produit ID ${id}...`);
      await apiClient.delete(`/inventory/produits/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['produits'] });
      queryClient.invalidateQueries({ queryKey: ['inventory', 'summary'] });
      console.log('✅ Produit supprimé et cache mis à jour');
    },
    onError: (error) => {
      console.error('❌ Erreur lors de la suppression du produit:', error);
    }
  });
};