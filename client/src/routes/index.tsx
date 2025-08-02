import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, useEffect, useCallback, useMemo, createContext } from 'react'
import { useAuth } from '@clerk/clerk-react'
import ServerDialogue from '@/components/serverDialogue'
import { createApi } from '@/lib/api'
import type { ChannelType, MessageType, ServerType } from '@/types/app.types'
import Sidebar from '@/components/sidebar'
import SecondSidebar from '@/components/secondSidebar'
import ChatBox from '@/components/ChatBox'
import { LoadingPage } from '@/components/ui/loading'
import type { contextType } from '@/types/context.type'
import { CreateChannelDialogue } from '@/components/createChannelDialogue'
import { fakeChannels, mockMessages } from '@/lib/mock'

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

export const MainContext = createContext<contextType | null>(null);

function RouteComponent() {
  const { getToken, isSignedIn } = useAuth();
  const [token, setToken] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [servers, setServers] = useState<ServerType[] | null>([]);
  const [showServerDialogue, setShowServerDialogue] = useState(false);
  const [selectSelectedChannel, setSelectedChannel] = useState<ChannelType | null>(null);
  const [messages, setMessages] = useState<MessageType[]>(mockMessages);
  const [showChannelCreateDialogue, setShowChannelCreateDialogue] = useState(false);
  const [channels, setChannels] = useState<ChannelType[]>(fakeChannels);
  const [channelCreationContext, setChannelCreationContext] = useState<{
    categoryId?: string;
    serverId: string;
  } | null>(null);

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
    if (!isSignedIn) {
      navigate({ to: '/signin' });
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
      <MainContext.Provider value={{
        token,
        setToken,
        showChannelCreateDialogue,
        setShowChannelCreateDialogue,
        channelCreationContext,
        setChannelCreationContext
      }}>
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
            <div className="flex items-center justify-center h-full text-gray-400">
              <p>No server selected. Servers: {servers?.length || 0}</p>
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
      </MainContext.Provider>
    </>
  )
}

