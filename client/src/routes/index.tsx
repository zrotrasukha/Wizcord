import { createFileRoute } from '@tanstack/react-router'
import react, { useMemo } from 'react'
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

export const TokenContext = react.createContext<contextType | null>(null);

function RouteComponent() {
  const { getToken, isSignedIn } = useAuth();
  const [token, setToken] = react.useState('');
  const [isLoading, setIsLoading] = react.useState(true);
  const [servers, setServers] = react.useState<ServerType[] | null>([]);
  const [showServerDialogue, setShowServerDialogue] = react.useState(false);


  const api = useMemo(() => {
    return token ? createApi(token) : null;
  }, [token]);

  const fetchServers = react.useCallback(async () => {
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
  react.useEffect(() => {
    const fetchToken = async () => {
      const token = await getToken({});
      setToken(token || '');
    }
    fetchToken();
  }, [getToken, isSignedIn]);

  react.useEffect(() => {
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
        {/* Server Creation Dialog */}
        {showServerDialogue ? (
          <ServerDialogue
            onComplete={onCompleteHandler}
            setShowServerDialogue={setShowServerDialogue}
          />
        ) : (
          // sidebar
          (
            <div className='h-screen w-screen bg-zinc-950 flex relative'>
              <Sidebar servers={servers} setShowServerDialogue={setShowServerDialogue} />
              {/* second sidebar */}
              <SecondSidebar server={servers![0]}/>
            </div>
          )
        )}
      </TokenContext.Provider>
    </>
  )
}

