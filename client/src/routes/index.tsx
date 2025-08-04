import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import ServerDialogue from '@/components/serverDialogue'
import type { ChannelType, MessageType } from '@/types/app.types'
import Sidebar from '@/components/sidebar'
import SecondSidebar from '@/components/secondSidebar'
import ChatBox from '@/components/ChatBox'
import { LoadingPage } from '@/components/ui/loading'
import type { contextType } from '@/types/context.type'
import { CreateChannelDialogue } from '@/components/createChannelDialogue'
import { mockMessages } from '@/lib/mock'
import { useAuthToken } from '@/hooks/useAuth'
import { useServer } from '@/hooks/useServer'
import { MainContextProvider } from '@/providers/MainContext'
import { useApi } from '@/hooks/useApi'
import { useChannels } from '@/hooks/useChannels'

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  const api = useApi();
  const { token, setToken, isLoading: isAuthLoading, isSignedIn } = useAuthToken();
  const [showServerDialogue, setShowServerDialogue] = useState(false);
  const [selectSelectedChannel, setSelectedChannel] = useState<ChannelType | null>(null);
  const [messages, setMessages] = useState<MessageType[]>(mockMessages);
  const [showChannelCreateDialogue, setShowChannelCreateDialogue] = useState(false);
  const { channels, setChannels } = useChannels({ api, token });
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

  const onCancel = () => {
    setShowServerDialogue(false);
  }

  const onCompleteHandler = async () => {
    await refreshServers();
    setShowServerDialogue(false);
  }

  if (isAuthLoading || isServerLoading && isSignedIn) {
    return <LoadingPage />
  }

  const sendMessageHandler = (message: string) => {
    if (!selectSelectedChannel) {
      console.error('No channel selected to send message');
      return;
    }
    const newMessage: MessageType = {
      id: Math.random().toString(36).substring(2, 15), // simple random ID
      content: message,
      // insert random user for now
      author: ['shivang', 'elon', 'grug', 'cat_gpt', 'hackerMan'][Math.floor(Math.random() * 5)],
      timestamp: new Date(),
      channelId: selectSelectedChannel.id,
    }
    // Here you would typically send the message to the server
    setMessages((prev) => [...prev, newMessage]);
  }

  const handleChannelCreate = (newChannel: ChannelType) => {
    setChannels((prev) => [...prev, newChannel]);
    setShowChannelCreateDialogue(false);
    setChannelCreationContext(null);
  }

  const handleChannelCancel = () => {
    setShowChannelCreateDialogue(false);
    setChannelCreationContext(null);
  }

  return (
    <>
      <MainContextProvider value={contextValue}>
        <div className='h-screen w-screen bg-zinc-950 flex relative'>
          <Sidebar servers={servers} setShowServerDialogue={setShowServerDialogue} />
          {servers && servers.length > 0 ? (
            <>
              <SecondSidebar
                channels={channels}
                setChannels={setChannels}
                server={servers[0]}
                selectedChannel={selectSelectedChannel}
                onChannelSelect={setSelectedChannel} />
              <ChatBox
                onSendMessage={sendMessageHandler}
                messages={messages}
                selectedChannel={selectSelectedChannel}
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
              onChannelCreate={handleChannelCreate}
              onCancel={handleChannelCancel}
              onComplete={handleChannelCancel}
            />
          )}
        </div>
      </MainContextProvider>
    </>
  )
}

