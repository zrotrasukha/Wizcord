import type { SecondSidebarProps, Category } from "@/types/app.types";
import { useContext, useEffect, useState } from "react";
import MainDropDown from "@/components/MainDropDown";
import { MainContext } from "@/providers/MainContext";
import { Categories, fakeChannels } from "@/lib/mock";
import { OrphanChannels } from "./OrphanChannels";
import CategorySection from "./CategorySection";

const SecondSidebar = ({
  serverId,
  selectedChannel,
  onChannelSelect,
  channels,
  setChannels
}: SecondSidebarProps) => {
  const [categories, setCategories] = useState<Category[]>(Categories);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const ctx = useContext(MainContext);

  if (!ctx) return null;

  const { setShowChannelCreateDialogue, setChannelCreationContext } = ctx;

  useEffect(() => {
    setChannels(fakeChannels.filter((channel) => channel.serverId === serverId));
  }, [serverId, setChannels]);

  const handleCreateChannelForCategory = (categoryId: string) => {
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
          serverId={serverId}
          triggerName={'Server'} // Replace with real name if available in props
          categories={categories}
          setCategories={setCategories}
        />
      </div>

      {/* Categories */}
      <div className="flex-1">
        {!serverId ? (
          <div className="flex items-center justify-center h-full text-gray-400">
            <p>No server selected</p>
          </div>
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
