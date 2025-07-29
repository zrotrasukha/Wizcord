import { createFileRoute } from '@tanstack/react-router'
import react, { useCallback } from 'react'
import { useAuth } from '@clerk/clerk-react'
import ServerDialogue from '@/components/ui/serverDialogue'
import { createApi, useHonoApi } from '@/lib/api'
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
  const api = useHonoApi(); 
  const fetchServers = useCallback(async () => {
    try{
      const response = await api.
    } catch(error) {
      console.error('Error fetching servers:', error);
      return [];
    }
  }, [api]);
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

