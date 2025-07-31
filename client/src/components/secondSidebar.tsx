import type { ServerType } from "@/types/app.types";
import { useEffect, useState } from "react";
import MainDropDown from "@/components/MainDropDown";
import { ChevronDown, ChevronRight, Hash, Volume2, Plus } from "lucide-react";

interface SecondSidebarProps {
  server: ServerType | null;
}
export interface ChannelType {
  id: string;
  name: string;
  type: 'text' | 'voice';
  serverId: string;
  categoryId: string;
}

interface Category {
  id: string;
  name: string;
  serverId: string;
}

const Categories: Category[] = [
  { id: 'cat1', name: 'Text Channels', serverId: "03e64685-b993-4f3d-9c9c-26bc24ae2e15" },
  { id: 'cat2', name: 'Voice Channels', serverId: "03e64685-b993-4f3d-9c9c-26bc24ae2e15" },
  { id: 'cat3', name: 'General', serverId: "b1e2c3d4-e5f6-7890-abcd-1234567890ef" }
];

const fakeChannels: ChannelType[] = [
  { id: '1', name: 'general', type: 'text', serverId: "03e64685-b993-4f3d-9c9c-26bc24ae2e15", categoryId: 'cat1' },
  { id: '2', name: 'random', type: 'text', serverId: "03e64685-b993-4f3d-9c9c-26bc24ae2e15", categoryId: 'cat1' },
  { id: '3', name: 'music', type: 'voice', serverId: "03e64685-b993-4f3d-9c9c-26bc24ae2e15", categoryId: 'cat2' },
  { id: '4', name: 'announcements', type: 'text', serverId: "b1e2c3d4-e5f6-7890-abcd-1234567890ef", categoryId: 'cat3' },
  { id: '5', name: 'lounge', type: 'voice', serverId: "b1e2c3d4-e5f6-7890-abcd-1234567890ef", categoryId: 'cat3' }
]

const SecondSidebar = ({ server }: SecondSidebarProps) => {
  const [channels, setChannel] = useState<ChannelType[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [selectSelectedChannel, setSelectedChannel] = useState<string | null>(null);
  useEffect(() => {
    setChannel(fakeChannels.filter((channel) => channel.serverId === server?.id))
  }, [server?.id]);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) => {
      if (prev.includes(categoryId)) {
        return prev.filter((id) => categoryId !== id);
      }
      return [...prev, categoryId];
    })
  }
  const handleSelectedChannel = (channelId: string) => {
    setSelectedChannel(channelId);
  }
  return (
    <div className="bg-zinc-700 h-full flex flex-col w-80 rounded-r-xl overflow-hidden">
      {/*Server Heading  */}
      <div className="flex items-center justify-center p-4 bg-zinc-800 mb-4">
        <MainDropDown triggerName={server!.name || ''} />
      </div>
      {/* Categories */}
      <div className="flex-1 ">
        {Categories.map((cat) => {
          const isExpanded = expandedCategories.includes(cat.id);
          const expandedChannels = channels.filter((ch) => {
            return ch.categoryId === cat.id && ch.serverId === server?.id;
          });
          return (
            <div key={cat.id} className="px-1">
              <button
                key={cat.id}
                onClick={() => toggleCategory(cat.id)}
                className="flex items-center hover:text-white text-xs uppercase text-left px-4 py-1 cursor-pointer group text-zinc-300 w-full"
              >
                {isExpanded ? (
                  <ChevronDown className="text-gray-400 h-4"/>
                ) : (
                  <ChevronRight />
                )}
                <span>{cat.name}</span>
              </button>
              {isExpanded && (
                <div className="w-full mx-2 px-6">
                  {expandedChannels.map((ch) => (
                    <div key={ch.id}
                      onClick={() => handleSelectedChannel(ch.id)}
                    >
                      <div className={`flex items-center h-7 rounded text-sm mb-2 text-gray-400  hover:bg-zinc-600 ${selectSelectedChannel === ch.id && 'bg-zinc-600'}`}>
                        {ch.type === 'text' ?
                          <Hash className="mr-2 h-4"  /> :
                          <Volume2 className="mr-2 h-4" />}
                        <span>{ch.name}</span>
                        <Plus className="hidden hover:block hover:opacity-100 transition-opacity"/>
                      </div>
                    </div>
                  )
                  )}

                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  )
}

export default SecondSidebar
