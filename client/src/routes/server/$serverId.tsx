import { useEffect, useState, useMemo } from "react";
import { useAuth } from "@clerk/clerk-react";

import { useServer } from "@/hooks/useServer";
import { useMessages } from "@/hooks/useMessage";
import { useChannels } from "@/hooks/useChannels";
import Sidebar from "@/components/sidebar";
import SecondSidebar from "@/components/secondSidebar";
import ChatBox from "@/components/ChatBox";
import { LoadingPage } from "@/components/ui/loading";
import ServerDialogue from "@/components/serverDialogue";
// import CreateChannelDialogue from "@/components/createChannelDialogue";
import { CreateChannelDialogue } from "@/components/createChannelDialogue";

import { MainContextProvider } from "@/providers/MainContext";
import type { ChannelType, MessageType, ServerType } from "@/types/app.types";
import type { contextType } from "@/types/context.type";
import { useApi } from "@/hooks/useApi";
import { createFileRoute } from "@tanstack/react-router";


export const Route = createFileRoute('/server/$serverId')({
  component: RouteComponent,
})

export default function RouteComponent() {
  const { userId, isLoaded: isAuthLoading, isSignedIn, getToken } = useAuth();

  const [token, setToken] = useState<string>("");
  const [showServerDialogue, setShowServerDialogue] = useState(false);
  const [showChannelCreateDialogue, setShowChannelCreateDialogue] = useState(false);
  const [selectedServer, setSelectedServer] = useState<ServerType | null>(null);
  const [channelCreationContext, setChannelCreationContext] = useState<{
    categoryId?: string;
    serverId: string;
  } | null>(null);
  const api = useApi();
  const { servers, isServerLoading, refreshServers } = useServer({ api, token });
  if (!servers) {
    return <LoadingPage />;
  }
  const { channels, setChannels, selectedChannel, setSelectedChannel } = useChannels({ api, token });
  const { messages, setMessages } = useMessages(selectedChannel);

  // 1. Get token on load
  useEffect(() => {
    (async () => {
      if (userId) {
        const t = await getToken();
        if (t) setToken(t);
      }
    })();
  }, [userId, getToken]);

  // 2. Restore last selected server
  useEffect(() => {
    if (servers.length > 0) {
      const lastId = localStorage.getItem("lastServerId");
      const found = servers.find(s => s.id === lastId);
      setSelectedServer(found || servers[0]);
    }
  }, [servers]);

  // 3. Update localStorage when server changes
  useEffect(() => {
    if (selectedServer) {
      localStorage.setItem("lastServerId", selectedServer.id);
    }
  }, [selectedServer]);

  // Context for children
  const contextValue = useMemo<contextType>(() => ({
    token,
    setToken,
    showChannelCreateDialogue,
    setShowChannelCreateDialogue,
    channelCreationContext,
    setChannelCreationContext,
  }), [token, showChannelCreateDialogue, channelCreationContext]);

  const onCancel = () => setShowServerDialogue(false);

  const onCompleteHandler = async () => {
    await refreshServers();
    setShowServerDialogue(false);
  };

  const sendMessageHandler = (message: string) => {
    if (!selectedChannel) return;

    const newMessage: MessageType = {
      id: Math.random().toString(36).substring(2, 15),
      content: message,
      author: ["shivang", "elon", "grug", "cat_gpt", "hackerMan"][Math.floor(Math.random() * 5)],
      timestamp: new Date(),
      channelId: selectedChannel.id,
    };

    setMessages(prev => [...prev, newMessage]);
  };

  const handleChannelCreate = (newChannel: ChannelType) => {
    setChannels(prev => [...prev, newChannel]);
    setShowChannelCreateDialogue(false);
    setChannelCreationContext(null);
  };

  const handleChannelCancel = () => {
    setShowChannelCreateDialogue(false);
    setChannelCreationContext(null);
  };

  if ((isAuthLoading || isServerLoading) && isSignedIn) {
    return <LoadingPage />;
  }

  return (
    <MainContextProvider value={contextValue}>
      <div className="h-screen w-screen bg-zinc-950 flex relative">
        <Sidebar servers={servers} setShowServerDialogue={setShowServerDialogue} />
        {servers.length > 0 ? (
          <>
            <SecondSidebar
              server={selectedServer}
              channels={channels}
              setChannels={setChannels}
              selectedChannel={selectedChannel}
              onChannelSelect={setSelectedChannel}
            />
            <ChatBox
              onSendMessage={sendMessageHandler}
              messages={messages}
              selectedChannel={selectedChannel}
            />
          </>
        ) : (
          <div className="bg-zinc-700 h-full flex flex-col w-80 rounded-r-xl overflow-hidden">
            <div className="flex items-center justify-center h-full text-gray-400 w-full">
              <p>No server selected.</p>
            </div>
          </div>
        )}

        {showServerDialogue && (
          <ServerDialogue
            onComplete={onCompleteHandler}
            setShowServerDialogue={setShowServerDialogue}
            onCancel={onCancel}
          />
        )}
        {showChannelCreateDialogue && (
          <CreateChannelDialogue
            onChannelCreate={handleChannelCreate}
            onCancel={handleChannelCancel}
            onComplete={handleChannelCancel}
          />
        )}
      </div>
    </MainContextProvider>
  );
}
