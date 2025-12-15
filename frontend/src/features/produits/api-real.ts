import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../api/client';
import type { Produit, NewProduit, InventorySummary, ConsommerProduitRequest, EditProduitRequest } from './types';

export const useProduitsReal = () => {
  return useQuery({
    queryKey: ['produits', 'real'],
    queryFn: async (): Promise<Produit[]> => {
      try {
        const response = await apiClient.get<Produit[]>('/inventory/produits');
        return response.data;
      } catch (error) {
        console.error(' Erreur lors de la récupération des produits:', error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useProduitsSearch = (query: string) => {
  return useQuery({
    queryKey: ['produits', 'search', query, 'real'],
    queryFn: async (): Promise<Produit[]> => {
      if (query.trim().length === 0) return [];

      const response = await apiClient.get<Produit[]>(`/inventory/produits/search?query=${encodeURIComponent(query)}`);
      return response.data;
    },
    enabled: query.trim().length > 0, 
    staleTime: 2 * 60 * 1000, 
  });
};

export const useInventorySummary = () => {
  return useQuery({
    queryKey: ['inventory', 'summary', 'real'],
    queryFn: async (): Promise<InventorySummary> => {
      const response = await apiClient.get<InventorySummary>('/inventory/summary');
      return response.data;
    },
    staleTime: 10 * 60 * 1000,
  });
};

export const useCreateProduit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (produit: NewProduit): Promise<Produit> => {
      const response = await apiClient.post<Produit>('/inventory/produits', produit);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['produits'] });
      queryClient.invalidateQueries({ queryKey: ['inventory', 'summary'] });
    },
    onError: (error) => {
      console.error(' Erreur lors de la création du produit:', error);
    }
  });
};

export const useConsommerProduit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: ConsommerProduitRequest }): Promise<Produit> => {
      const response = await apiClient.post<Produit>(`/inventory/produits/${id}/sortie`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['produits'] });
      queryClient.invalidateQueries({ queryKey: ['inventory', 'summary'] });
    },
    onError: (error) => {
      console.error(' Error en sortie de stock:', error);
    }
  });
};

export const useProduitsAlerts = () => {
  return useQuery({
    queryKey: ['produits', 'alerts', 'real'],
    queryFn: async (): Promise<Produit[]> => {
      const response = await apiClient.get<Produit[]>('/inventory/produits/alerts');
      return response.data;
    },
  });
};

export const useProduitsExpiring = () => {
  return useQuery({
    queryKey: ['produits', 'expiring', 'real'],
    queryFn: async (): Promise<Produit[]> => {
      const response = await apiClient.get<Produit[]>('/inventory/produits/expiring');
      return response.data;
    },
  });
};

export const useEditProduit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: EditProduitRequest }): Promise<Produit> => {
      const response = await apiClient.put<Produit>(`/inventory/produits/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['produits'] });
      queryClient.invalidateQueries({ queryKey: ['inventory', 'summary'] });
    },
    onError: (error) => {
      console.error(' Erreur lors de l\'édition du produit:', error);
    }
  });
};

export const useDeleteProduit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number): Promise<void> => {
      await apiClient.delete(`/inventory/produits/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['produits'] });
      queryClient.invalidateQueries({ queryKey: ['inventory', 'summary'] });
    },
    onError: (error) => {
      console.error(' Erreur lors de la suppression du produit:', error);
    }
  });
};