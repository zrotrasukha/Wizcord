import type { SecondSidebarProps } from "@/types/app.types";
import { useContext, useEffect, useState } from "react";
import MainDropDown from "@/components/MainDropDown";
import { MainContext } from "@/providers/MainContext";
import { OrphanChannels } from "./OrphanChannels";
import CategorySection from "./CategorySection";
import { useCategory } from "@/hooks/useCategory";
import { useChannel } from "@/hooks/useChannel";
import { useApi } from "@/hooks/useApi";
import { useAuthToken } from "@/hooks/useAuth";

const SecondSidebar = ({
  serverId,
  selectedChannel,
  onChannelSelect,
}: SecondSidebarProps) => {
  const { categories, refreshCategories, isCategoryLoading } = useCategory({ serverId });
  const api = useApi();
  const { token } = useAuthToken();

  const { channels, loadingChannels, refreshChannels } = useChannel({
    api,
    serverId: serverId || '',
    token: token || ''
  });

  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const ctx = useContext(MainContext);

  if (!ctx) return null;

  const { showChannelCreateDialogue, setShowChannelCreateDialogue, setChannelCreationContext, channelCreationContext } = ctx;

  const handleChannelCreated = async (categoryId?: string) => {

    await Promise.all([
      refreshChannels(),
      refreshCategories()
    ]);

    if (categoryId && !expandedCategories.includes(categoryId)) {
      setExpandedCategories((prev) => [...prev, categoryId]);
    }
  };


  useEffect(() => {
    if (!showChannelCreateDialogue) {
      const categoryId = channelCreationContext?.categoryId;
      handleChannelCreated(categoryId)
    }
  }, [showChannelCreateDialogue])

  const handleCreateChannelForCategory = async (categoryId: string) => {
    setShowChannelCreateDialogue(true);
    setChannelCreationContext({ serverId, categoryId });
  };

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  return (
    <div className="bg-zinc-700 h-full flex flex-col w-80 rounded-r-xl overflow-hidden">
      {/* Server Heading */}
      <div className="flex items-center justify-center p-4 bg-zinc-800 mb-4">
        <MainDropDown
          refreshCategories={refreshCategories}
          serverId={serverId}
          triggerName={'Server'}
          categories={categories}
        />
      </div>

      {/* Categories */}
      <div className="flex-1">
        {!serverId ? (
          <div className="flex items-center justify-center h-full text-gray-400">
            <p>No server selected</p>
          </div>
        ) : (isCategoryLoading || loadingChannels) ? (
          <div className="text-center text-gray-400">Loading...</div>
        ) : (
          <>
            <OrphanChannels
              channels={channels}
              serverId={serverId}
              onChannelSelect={onChannelSelect}
              selectedChannel={selectedChannel}
            />

            {categories.map((category) => (
              <CategorySection
                key={category.id}
                category={category}
                channels={channels}
                serverId={serverId}
                selectedChannel={selectedChannel}
                isExpanded={expandedCategories.includes(category.id)}
                onToggleCategory={toggleCategory}
                onChannelSelect={onChannelSelect}
                onCreateChannel={handleCreateChannelForCategory}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default SecondSidebar;
