import { createFileRoute } from '@tanstack/react-router'
import react, { useMemo } from 'react'
import { useAuth } from '@clerk/clerk-react'
import ServerDialogue from '@/components/ui/serverDialogue'
import { createApi } from '@/lib/api'
import type { ServerType } from '@/types/app.types'
import { FaCirclePlus as Plus } from "react-icons/fa6";

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
          <div className='h-screen w-screen bg-zinc-950 flex items-center relative'>
            {/* sidebar */}
            <div className='py-2 absolute flex flex-col h-screen w-[65px] bg-zinc-600 left-0  overflow-hidden'>
              {/* Plus icon */} 
              <button className='mb-2 w-full h-14 bg-transparent flex items-center justify-center p-0 '
                onClick={() => setShowServerDialogue(true)}>
                <Plus size={42} className='text-white hover:text-blue-400 transition-all duration-200 cursor-pointer' />
              </button>
              <div className='h-[2px] w-3/4 place-self-center bg-white rounded-2xl mb-3 ' />
              {/* server list*/}
              <div>
                {servers?.map((server) => {
                  return (
                    <div key={server.id} className='w-full h-14  flex items-center justify-center p-0 hover:bg-zinc-800 transition-colors cursor-pointer '>
                      {server.icon ? (
                        <img
                          src={server.icon}
                          alt={server.name}
                          className='w-8 h-8 rounded-full object-cover'
                        />
                      ) : (
                        <button className='w-12 h-12 bg-zinc-500 rounded-full flex items-center justify-center'>
                          <span className='text-white text-xs font-bold'>
                            {server.name.charAt(0).toUpperCase()}
                          </span>
                        </button>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </TokenContext.Provider>
    </>
  )
}

