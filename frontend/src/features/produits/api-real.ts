import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../api/client';
import type { Produit, NewProduit, InventorySummary, ConsommerProduitRequest } from './types';

// Hook principal para obtener productos del backend real
export const useProduitsReal = () => {
  return useQuery({
    queryKey: ['produits', 'real'],
    queryFn: async (): Promise<Produit[]> => {
      console.log('🔍 useProduits: Obteniendo productos del backend real...');
      try {
        const response = await apiClient.get<Produit[]>('/inventory/produits');
        console.log('✅ Productos obtenidos:', response.data.length);
        return response.data;
      } catch (error) {
        console.error('❌ Error obteniendo productos:', error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

// Hook para buscar productos
export const useProduitsSearch = (query: string) => {
  return useQuery({
    queryKey: ['produits', 'search', query, 'real'],
    queryFn: async (): Promise<Produit[]> => {
      if (query.trim().length === 0) return [];
      
      console.log('🔍 Buscando productos:', query);
      const response = await apiClient.get<Produit[]>(`/inventory/produits/search?query=${encodeURIComponent(query)}`);
      return response.data;
    },
    enabled: query.trim().length > 0, // Solo ejecutar si hay query
    staleTime: 2 * 60 * 1000, // 2 minutos para búsquedas
  });
};

// Hook para obtener resumen del inventario
export const useInventorySummary = () => {
  return useQuery({
    queryKey: ['inventory', 'summary', 'real'],
    queryFn: async (): Promise<InventorySummary> => {
      console.log('📊 Obteniendo resumen del inventario...');
      const response = await apiClient.get<InventorySummary>('/inventory/summary');
      return response.data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutos
  });
};

// Hook para crear productos
export const useCreateProduit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (produit: NewProduit): Promise<Produit> => {
      console.log('➕ Creando producto:', produit.nom);
      const response = await apiClient.post<Produit>('/inventory/produits', produit);
      return response.data;
    },
    onSuccess: () => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['produits'] });
      queryClient.invalidateQueries({ queryKey: ['inventory', 'summary'] });
      console.log('✅ Producto creado y cache actualizado');
    },
    onError: (error) => {
      console.error('❌ Error creando producto:', error);
    }
  });
};

// Hook para consumir productos
export const useConsommerProduit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: ConsommerProduitRequest }): Promise<Produit> => {
      console.log(`🍽️ Consumiendo producto ID ${id}:`, data.quantite);
      const response = await apiClient.post<Produit>(`/inventory/produits/${id}/consommer`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['produits'] });
      queryClient.invalidateQueries({ queryKey: ['inventory', 'summary'] });
      console.log('✅ Producto consumido y cache actualizado');
    },
    onError: (error) => {
      console.error('❌ Error consumiendo producto:', error);
    }
  });
};

// Hooks adicionales disponibles en el backend
export const useProduitsAlerts = () => {
  return useQuery({
    queryKey: ['produits', 'alerts', 'real'],
    queryFn: async (): Promise<Produit[]> => {
      console.log('🚨 Obteniendo productos en alerta...');
      const response = await apiClient.get<Produit[]>('/inventory/produits/alerts');
      return response.data;
    },
  });
};

export const useProduitsExpiring = () => {
  return useQuery({
    queryKey: ['produits', 'expiring', 'real'],
    queryFn: async (): Promise<Produit[]> => {
      console.log('⏰ Obteniendo productos próximos a vencer...');
      const response = await apiClient.get<Produit[]>('/inventory/produits/expiring');
      return response.data;
    },
  });
};