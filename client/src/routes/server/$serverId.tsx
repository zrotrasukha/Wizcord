
import { createFileRoute, useParams } from '@tanstack/react-router'
import { useState } from 'react'
import ServerDialogue from '@/components/serverDialogue'
import Sidebar from '@/components/sidebar'
import SecondSidebar from '@/components/secondSidebar'
import ChatBox from '@/components/ChatBox'
import { LoadingPage } from '@/components/ui/loading'
import type { contextType } from '@/types/context.type'
import { CreateChannelDialogue } from '@/components/createChannelDialogue'
import { useAuthToken } from '@/hooks/useAuth'
import { useServer } from '@/hooks/useServer'
import { MainContextProvider } from '@/providers/MainContext'
import { useApi } from '@/hooks/useApi'
import { useChannel } from '@/hooks/useChannel'
import { useMessages } from '@/hooks/useMessage'

export const Route = createFileRoute('/server/$serverId')({
  component: RouteComponent,
})

function RouteComponent() {
  const api = useApi();
  const { serverId } = useParams({ from: '/server/$serverId' });
  const { token, setToken, isLoading: isAuthLoading, isSignedIn } = useAuthToken();
  const [showServerDialogue, setShowServerDialogue] = useState(false);
  const [showChannelCreateDialogue, setShowChannelCreateDialogue] = useState(false);
  const { setChannels, selectedChannel, setSelectedChannel } = useChannel({ api, serverId, token });
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
    serverId
  };

  const { servers, isServerLoading, refreshServers } = useServer({ api, token });

  const { sendMessageHandler, messages } = useMessages(selectedChannel);

  if (isAuthLoading || isServerLoading && isSignedIn) {
    return <LoadingPage />
  }

  // Route native functions
  const handleChannelCancel = () => {
    setShowChannelCreateDialogue(false);
    setChannelCreationContext(null);
  }

  const onCancel = () => {
    setShowServerDialogue(false);
  }

  const onCompleteHandler = async () => {
    await refreshServers();
    setShowServerDialogue(false);
  }
  return (
    <>
      <MainContextProvider value={contextValue}>
        <div className='h-screen w-screen bg-zinc-950 flex relative'>
          <Sidebar
            servers={servers}
            setShowServerDialogue={setShowServerDialogue}
            selectedServer={serverId}
          />
          {servers && servers.length > 0 ? (
            <>
              <SecondSidebar
                setChannels={setChannels}
                serverId={serverId}
                selectedChannel={selectedChannel}
                onChannelSelect={setSelectedChannel} />
              <ChatBox
                onSendMessage={sendMessageHandler}
                messages={messages}
                selectedChannel={selectedChannel}
              />
            </>
          ) : (
            <div className="bg-zinc-700 h-full flex flex-col w-80 rounded-r-xl overflow-hidden">
              <div className='flex items-center justify-center h-full text-gray-400 w-full '>
                <p>No server selected. Servers</p>
              </div>
            </div>
          )}
          {/* Server Creation Dialog */}
          {showServerDialogue && (
            <ServerDialogue
              onComplete={onCompleteHandler}
              setShowServerDialogue={setShowServerDialogue}
              onCancel={onCancel}
            />
          )}
          {/* Channel Creation Dialog */}
          {showChannelCreateDialogue && (
            <CreateChannelDialogue
              onCancel={handleChannelCancel}
              onComplete={handleChannelCancel}
            />
          )}
        </div>
      </MainContextProvider>
    </>
  )
}
