import { createFileRoute } from '@tanstack/react-router'
import react from 'react'
import { useAuth } from '@clerk/clerk-react'
import ServerDialogue from '@/components/ui/serverDialogue'
import { createApi } from '@/lib/api'
import type { ServerType } from '@server/src/types/server.type'
import { FaCirclePlus } from "react-icons/fa6";

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
  const [servers, setServers] = react.useState<ServerType[]>([]);
  const [showServerDialogue, setShowServerDialogue] = react.useState(false);


  const api = createApi(token);
  const fetchServers = async () => {
    try {
      const res = await api.server.getservers.$get();
      const data = (await res.json()) as { servers: ServerType[] };
      return data.servers;
    } catch (e) {
      console.error("Failed to fetch servers", e);
      return [];
    }
  };
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
      setServers(servers);
      setShowServerDialogue(servers.length === 0);
      setIsLoading(false);
    }
    loadServers();
  }, [token]);


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
        {showServerDialogue ? (
          <ServerDialogue
            onComplete={onCompleteHandler}
          />
        ) : (
          <div className='h-screen w-screen bg-zinc-950 flex items-center relative'>
              // sidebar
            <div className='absolute flex flex-col h-screen w-[65px] bg-zinc-600 left-0  overflow-hidden'>
              <div className='w-full h-14 bg-blue-600 flex items-center justify-center p-0 '>
                <FaCirclePlus size={40} className='text-white rounded-full hover:bg-white hover:text-blue-500 hover:shadow-2xl transition-colors' />
              </div>
            </div>
          </div>
        )}
      </TokenContext.Provider>
    </>
  )
}

