import { useCallback, useEffect, useState } from "react"
import { type Category } from "@/types/app.types";
import { useApi } from "./useApi";
import { useAuthToken } from "./useAuth";

export const useCategory = ({ serverId }: { serverId: string }) => {
  const [categories, setCategories] = useState<Category[] | []>([]);
  const [isCategoryLoading, setIsCategoryLoading] = useState(true);
  const api = useApi();
  const { token } = useAuthToken();

  const fetchCategories = useCallback(async (serverId: string) => {
    if (!api) return [];
    try {
      const res = await api.category.all.$get({
        query: { serverId }
      })
      if (!res.ok) {
        console.error('Failed to fetch categories:', res.statusText);
        return [];
      }
      const data = await res.json();
      if (data && typeof data === 'object' && 'categories' in data && Array.isArray(data.categories)) {
        console.log("Fetched categories:", data.categories);
        return data.categories as Category[];
      }
      console.error('Unexpected response while fetching categories');
      return [];
    } catch (error) {
      console.error('Unexpected response while fetching categories: ', error);
      return [];
    }
  }, [api])

  useEffect(() => {
    if (!token) return;
    setIsCategoryLoading(true);
    const loadCategories = async () => {
      const categories = await fetchCategories(serverId);
      setCategories(categories);
      setIsCategoryLoading(false);
    }
    loadCategories();
  }, [token, fetchCategories, serverId])

  const refreshCategories = useCallback(async () => {
    if (!token) return;
    const categories = await fetchCategories(serverId);
    setCategories(categories as Category[]);
  }, [fetchCategories, token, serverId])

  return {
    categories,
    isCategoryLoading,
    refreshCategories,
    setCategories,
    fetchCategories
  }
}
