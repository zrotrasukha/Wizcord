import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, useEffect, useCallback, useMemo, createContext } from 'react'
import { useAuth } from '@clerk/clerk-react'
import ServerDialogue from '@/components/serverDialogue'
import { createApi } from '@/lib/api'
import type { ServerType } from '@/types/app.types'
import Sidebar from '@/components/sidebar'
import SecondSidebar from '@/components/secondSidebar'

export const Route = createFileRoute('/')({
  component: RouteComponent,
})
type contextType = {
  token: string;
  setToken: React.Dispatch<React.SetStateAction<string>>;
};

export const TokenContext = createContext<contextType | null>(null);

function RouteComponent() {
  const { getToken, isSignedIn } = useAuth();
  const [token, setToken] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [servers, setServers] = useState<ServerType[] | null>([]);
  const [showServerDialogue, setShowServerDialogue] = useState(false);

  const onCancel = () => {
    setShowServerDialogue(false);
  }

  const api = useMemo(() => {
    return token ? createApi(token) : null;
  }, [token]);

  const fetchServers = useCallback(async () => {
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
      };

      console.error('Unexpected response format:', data);
      return [];
    } catch (error) {
      console.error('Error fetching servers:', error);
      return [];
    }
  }, [api]);

  const navigate = useNavigate();
  useEffect(() => {
    if(!isSignedIn) {
      navigate({to: '/signin'});      
    }
    const fetchToken = async () => {
      const token = await getToken({});
      setToken(token || '');
    }
    fetchToken();
  }, [getToken, isSignedIn]);

  useEffect(() => {
    if (!token) return;
    setIsLoading(true);
    const loadServers = async () => {
      const servers = await fetchServers();
      setServers(servers as ServerType[]);
      setShowServerDialogue(servers.length === 0);
      setIsLoading(false);
    }
    loadServers();
  }, [token, fetchServers]);
  const onCompleteHandler = async () => {
    const servers = await fetchServers();
    setServers(servers);
    setShowServerDialogue(false);
  }
  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <TokenContext.Provider value={{ token, setToken }}>
        <div className='h-screen w-screen bg-zinc-950 flex relative'>
          <Sidebar servers={servers} setShowServerDialogue={setShowServerDialogue} />
          <SecondSidebar server={servers![0]} />
          {/* Server Creation Dialog */}
          {showServerDialogue && (
            <ServerDialogue
              onComplete={onCompleteHandler}
              setShowServerDialogue={setShowServerDialogue}
              onCancel={onCancel}
            />
          )}
        </div>
      </TokenContext.Provider>
    </>
  )
}

