import { type ApiType } from "@/lib/api";
import type { ServerType } from "@/types/app.types";
import { useCallback, useEffect, useState } from "react"

interface useServerProps {
  api: ApiType | null;
  token: string;
}

export const useServer = ({ api, token }: useServerProps) => {

  const [servers, setServers] = useState<ServerType[] | null>([]);
  const [isServerLoading, setIsServerLoading] = useState(true);

  const fetchServers = useCallback(async () => {
    try {
      if (!api) return [];

      const serverRes = await api.server.getservers.$get();
      if (!serverRes.ok) {
        console.error('Failed to fetch servers:', serverRes.statusText);
        return [];
      }

      const data = await serverRes.json();
      if (data && typeof data === 'object' && 'servers' in data && Array.isArray(data.servers)) {
        return data.servers as ServerType[];
      }

      console.error('Unexpected response format:', data);
      return [];
    } catch (error) {
      console.error('Error fetching servers:', error);
      return [];
    }
  }, [api])

  useEffect(() => {
    if (!token) return;
    setIsServerLoading(true);
    const loadServers = async () => {
      const servers = await fetchServers();
      setServers(servers as ServerType[]);
      setIsServerLoading(false);
    }
    loadServers();
  }, [token, fetchServers])

  const refreshServers = useCallback(async () => {
    if (!token) return;
    const servers = await fetchServers();
    setServers(servers as ServerType[]);
  }, [fetchServers, token])


  return { servers, isServerLoading, setServers, fetchServers, refreshServers }
}

