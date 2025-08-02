import type { SecondSidebarProps, ChannelType, Category } from "@/types/app.types";
import { useContext, useEffect, useState } from "react";
import MainDropDown from "@/components/MainDropDown";
import { ChevronDown, ChevronRight, Hash, Volume2, Plus } from "lucide-react";
import { MainContext } from "@/routes";
import { Categories, fakeChannels } from "@/lib/mock";

const SecondSidebar = ({ server, selectedChannel, onChannelSelect }: SecondSidebarProps) => {
  const [channels, setChannel] = useState<ChannelType[]>(fakeChannels);
  const [categories, setCategories] = useState<Category[]>(Categories);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const ctx = useContext(MainContext);
  if (!ctx) return null;
  const { setShowChannelCreateDialogue } = ctx;
  // Initialize categories based on the server
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

  const handleChannelClick = (channel: ChannelType) => {
    onChannelSelect(channel);
  }
  return (
    <div className="bg-zinc-700 h-full flex flex-col w-80 rounded-r-xl overflow-hidden">
      {/*Server Heading  */}
      <div className="flex items-center justify-center p-4 bg-zinc-800 mb-4">
        <MainDropDown triggerName={server?.name || 'No Server'} categories={categories} setCategories={setCategories} />
      </div>
      {/* Categories */}
      <div className="flex-1 ">
        {!server ? (
          <div className="flex items-center justify-center h-full text-gray-400">
            <p>No server selected</p>
          </div>
        ) : (
          categories.map((cat) => {
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
                    <ChevronDown className="text-gray-400 h-4" />
                  ) : (
                    <ChevronRight />
                  )}
                  <span className="flex-1">{cat.name}</span>
                  <Plus className="hidden group-hover:block h-4"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowChannelCreateDialogue(true)
                    }}
                  />

                </button>
                {isExpanded && (
                  <div className="w-full mx-2 px-6">
                    {expandedChannels.map((ch) => (
                      <div key={ch.id}
                        onClick={() => handleChannelClick(ch)}
                      >
                        <div className={`flex items-center h-7 rounded text-sm mb-2 text-gray-400 hover:bg-zinc-600 cursor-pointer px-2 ${selectedChannel?.id === ch.id ? 'bg-zinc-600 text-white' : ''}`}>
                          {ch.type === 'text' ?
                            <Hash className="mr-2 h-4" /> :
                            <Volume2 className="mr-2 h-4" />}
                          <span>{ch.name}</span>
                        </div>
                      </div>
                    )
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  )
}

export default SecondSidebar
