import { useQuery } from '@tanstack/react-query';
import apiClient from './apiClient';
import { STALE_TIME_MS } from '@constants/student';

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

export async function fetchProducts(): Promise<Product[]> {
  const response = await apiClient.get<Product[]>('/products?limit=12');
  return response.data;
}

export function useProducts() {
  return useQuery<Product[], Error>({
    queryKey: ['products'],
    queryFn: fetchProducts,
    staleTime: STALE_TIME_MS,
  });
}
