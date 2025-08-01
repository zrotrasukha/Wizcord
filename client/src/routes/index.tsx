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

export const Route = createFileRoute('/')({
  component: RouteComponent,
})
type contextType = {
  token: string;
  setToken: React.Dispatch<React.SetStateAction<string>>;
};

export const TokenContext = createContext<contextType | null>(null);

const mockMessages: MessageType[] = [
  {
    id: 'msg-1',
    content: 'yo what’s up',
    author: 'shivang',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1), // 1 hour ago
    channelId: '1', // general
  },
  {
    id: 'msg-2',
    content: 'did you deploy the build?',
    author: 'elon',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    channelId: '1', // general
  },
  {
    id: 'msg-3',
    content: 'production is 🔥 again',
    author: 'grug',
    timestamp: new Date(Date.now() - 1000 * 60 * 20), // 20 mins ago
    channelId: '2', // random
  },
  {
    id: 'msg-4',
    content: 'bruh it crashed again',
    author: 'cat_gpt',
    timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 mins ago
    channelId: '2', // random
  },
  {
    id: 'msg-5',
    content: 'lol nice try',
    author: 'hackerMan',
    timestamp: new Date(), // now
    channelId: '4', // announcements
  },
]
function RouteComponent() {
  const { getToken, isSignedIn } = useAuth();
  const [token, setToken] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [servers, setServers] = useState<ServerType[] | null>([]);
  const [showServerDialogue, setShowServerDialogue] = useState(false);
  const [selectSelectedChannel, setSelectedChannel] = useState<ChannelType | null>(null);
  const [messages, setMessages] = useState<MessageType[]>(mockMessages);
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
  return (
    <>
      <TokenContext.Provider value={{ token, setToken }}>
        <div className='h-screen w-screen bg-zinc-950 flex relative'>
          <Sidebar servers={servers} setShowServerDialogue={setShowServerDialogue} />
          {servers && servers.length > 0 ? (
            <>
              <SecondSidebar
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
              <p>No server selected</p>
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
        </div>
      </TokenContext.Provider>
    </>
  )
}

