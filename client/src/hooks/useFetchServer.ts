import type { ApiType } from "@/lib/api";
import type { ServerType } from "@/types/app.types";
import { useCallback, useEffect, useState } from "react";

interface useFetchServerProps {
  api: ApiType | null;
  token: string;
}

export const useFetchServer = ({ api, token }: useFetchServerProps) => {
  const [servers, setServers] = useState<ServerType[] | null>([]);
  const [isLoadingServers, setIsLoadingServers] = useState(false);

  const fetchServers = useCallback(async (): Promise<ServerType[]> => {
    if (!api) return [];
    try {
      const res = await api.server.getservers.$get();
      if (!res.ok) {
        console.error('Failed to fetch servers:', res.statusText);
        return [];
      }

      const data = await res.json();
      if (data && typeof data === 'object' && 'servers' in data && Array.isArray(data.servers)) {
        return data.servers as ServerType[];
      }

      console.error('Unexpected response format:', data);
      return [];
    } catch (error) {
      console.log('Error fetching servers:', error);
      return [];
    }
  }, [api])

  useEffect(() => {
    if (!token) return;
    setIsLoadingServers(true);
    const loadServers = async () => {
      const servers = await fetchServers();
      setServers(servers as ServerType[]);
      setIsLoadingServers(false);
    }
    loadServers();
  }, [token, fetchServers]);

  return {
    servers,
    isLoadingServers,
    setServers,
    fetchServers
  }
}
