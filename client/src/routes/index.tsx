import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import ServerDialogue from '@/components/serverDialogue'
import { LoadingPage } from '@/components/ui/loading'
import type { contextType } from '@/types/context.type'
import { useAuthToken } from '@/hooks/useAuth'
import { useServer } from '@/hooks/useServer'
import { MainContextProvider } from '@/providers/MainContext'
import { useApi } from '@/hooks/useApi'

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  const api = useApi();
  const { token, setToken, isLoading: isAuthLoading, isSignedIn } = useAuthToken();
  const [showServerDialogue, setShowServerDialogue] = useState(false);
  const [showChannelCreateDialogue, setShowChannelCreateDialogue] = useState(false);
  const [channelCreationContext, setChannelCreationContext] = useState<{
    categoryId?: string;
    serverId: string;
  } | null>(null);

  const contextValue: contextType = {
    token,
    setToken,
    showChannelCreateDialogue,
    setShowChannelCreateDialogue,
    channelCreationContext,
    setChannelCreationContext,
  }
  const { servers, isServerLoading, refreshServers } = useServer({ api, token });

  const onCompleteHandler = async () => {
    await refreshServers();
    setShowServerDialogue(false);
  }

  const navigate = useNavigate();
  const lastSelectedServer = localStorage.getItem('selectedServer');

  useEffect(() => {
    if (isAuthLoading || isServerLoading) {
      return;
    }

    if (lastSelectedServer) {
      navigate({ to: `/server/${lastSelectedServer}` });
    } else if (servers && servers.length > 0) {
      navigate({ to: `/server/${servers[0].id}` });
    } else {
      setShowServerDialogue(true);
    }
  }, [servers, isAuthLoading, isServerLoading, navigate])

  if (isAuthLoading || isServerLoading && isSignedIn) {
    return <LoadingPage />
  }

  return (
    <>
      <MainContextProvider value={contextValue}>
        <div className='bg-amber-100 flex h-screen w-screen items-center justify-center'> ulululul</div>
        {showServerDialogue && (
          <ServerDialogue
            onComplete={onCompleteHandler}
            onCancel={() => setShowServerDialogue(false)}
            setShowServerDialogue={setShowServerDialogue}
          />
        )}
      </MainContextProvider>
    </>
  )
}

