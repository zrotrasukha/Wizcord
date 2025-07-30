import { createApi } from "@/lib/api";
import type { ServerType } from "@/types/app.types";
import { useCallback, useEffect, useMemo, useState } from "react"

export const useServer = (token: string) => {
    const [servers, setServers] = useState<ServerType[] | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const api = useMemo(() => {
        return token ? createApi(token) : null;
    }, [token])

    const fetchServers = useCallback(async () => {
        try {

            if (!api) return [];

            const serverRes = await api.server.getservers.$get();
            if (!serverRes.ok) {
                console.error('Failed to fetch servers:', serverRes.statusText);
                return [];
            }
            const data = (await serverRes.json()) as { Servers: ServerType[] };
            if (data && typeof data === 'object' && 'Servers' in data && Array.isArray(data)) {
                return data.Servers as ServerType[];
            }
            console.error('Unexpected response format:', data);
        } catch (error) {
            console.error('Error fetching servers:', error);
        }
    }, [api])

    useEffect(() => {
        if (!token) return;
        setIsLoading(true);
        const loadServers = async () => {
            const servers = await fetchServers();
            setServers(servers as ServerType[]);
            setIsLoading(false);
        }
        loadServers();
    }, [token, fetchServers])

    const refreshServers = useCallback(async () => {
        if (!token) return;
        const servers = await fetchServers();
        setServers(servers as ServerType[]);
    }, [fetchServers])


    return { servers, fetchServers, refreshServers }
}

