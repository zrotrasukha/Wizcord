import { createApi } from '@/lib/api'
import { createContext, useContext } from 'react';

export type ApiType = ReturnType<typeof createApi>;

const ApiContextProvider = createContext<ApiType | null>(null);

export const useApi = () => {
  const api = useContext(ApiContextProvider);
  if (!api) {
    throw new Error('ApiContextProvider is not provided');
  }
  return api;
}
