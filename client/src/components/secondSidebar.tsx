import type { ServerType } from "@/types/app.types";
import { useEffect, useState } from "react";
import MainDropDown from "./MainDropDown";

interface SecondSidebarProps {
  server: ServerType | null;
}
interface ChannelType {
  id: string; 
  name: string; 
  type: 'text'| 'voice';
  serverId: string;
}
  
interface Category {
  id: string;
  name: string;
  serverId: string;
}

const fakeCategories: Category[] = [
  { id: 'cat1', name: 'Text Channels', serverId: "03e64685-b993-4f3d-9c9c-26bc24ae2e15" },
  { id: 'cat2', name: 'Voice Channels', serverId: "03e64685-b993-4f3d-9c9c-26bc24ae2e15" },
  { id: 'cat3', name: 'General', serverId: "b1e2c3d4-e5f6-7890-abcd-1234567890ef" }
];

const fakeChannels :ChannelType[] = [
  { id: '1', name: 'general', type: 'text', serverId: "03e64685-b993-4f3d-9c9c-26bc24ae2e15"},
  { id: '2', name: 'random', type: 'text', serverId: "03e64685-b993-4f3d-9c9c-26bc24ae2e15"},
  { id: '3', name: 'music', type: 'voice', serverId: "03e64685-b993-4f3d-9c9c-26bc24ae2e15"},
  { id: '4', name: 'announcements', type: 'text', serverId: "b1e2c3d4-e5f6-7890-abcd-1234567890ef"},
  { id: '5', name: 'lounge', type: 'voice', serverId: "b1e2c3d4-e5f6-7890-abcd-1234567890ef"}
]

const SecondSidebar = ({server}: SecondSidebarProps) => {
  const [channels, setChannel] = useState<ChannelType[]>([]);
  useEffect(() => {
    setChannel(fakeChannels.filter((channel) => channel.serverId === server?.id))
  }, [server?.id]);

  return (
    <div className="bg-gray-800 w-72 h-full p-4 ">
      <MainDropDown triggerName={server?.name || ''} />
      {/* servers */}
      {channels.map((channel) => {
        return (
          <div key={channel.id} className="bg-gray-700 p-2 my-2 rounded hover:bg-gray-600">
            <h2 className="text-white text-lg">{channel.name}</h2>
          </div>
        )
      })}
    </div>
  )
}

export default SecondSidebar
