import { type ApiType } from "@/lib/api";
import type { ServerType } from "@/types/app.types";
import { useCallback, useEffect, useState } from "react"

interface useServerProps {
  api: ApiType | null;
  token: string;
}

export const useServer = ({ api, token }: useServerProps) => {

  const [servers, setServers] = useState<ServerType[] | null>([]);  // ✅ Start with empty array like working code
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
      // ✅ Use lowercase 'servers' like your working code
      if (data && typeof data === 'object' && 'servers' in data && Array.isArray(data.servers)) {
        return data.servers as ServerType[];
      }

      console.error('Unexpected response format:', data);
      return [];
    } catch (error) {
      console.error('Error fetching servers:', error);
      return [];
    }
  }, [api])  // ✅ Remove token from dependency since it's not used inside function

  useEffect(() => {
    console.log('useServer: useEffect triggered, token:', token, 'api:', !!api);
    if (!token) return;
    setIsServerLoading(true);
    const loadServers = async () => {
      console.log('useServer: About to fetch servers...');
      const servers = await fetchServers();
      console.log('useServer: Fetched servers:', servers, 'Count:', servers.length);
      setServers(servers as ServerType[]);
      setIsServerLoading(false);
    }
    loadServers();
  }, [token, fetchServers])

  const refreshServers = useCallback(async () => {
    if (!token) return;
    const servers = await fetchServers();
    setServers(servers as ServerType[]);
  }, [fetchServers, token])  // ✅ Add token dependency since it's used here


  return { servers, isServerLoading, setServers, fetchServers, refreshServers }
}

