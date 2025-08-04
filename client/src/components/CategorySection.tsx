import { ChevronDown, ChevronRight, Hash, Volume2, Plus } from "lucide-react";
import type { ChannelType, Category } from "@/types/app.types";

interface CategorySectionProps {
  category: Category;
  channels: ChannelType[];
  serverId: string;
  selectedChannel: ChannelType | null;
  isExpanded: boolean;
  onToggleCategory: (categoryId: string) => void;
  onChannelSelect: (channel: ChannelType) => void;
  onCreateChannel: (categoryId: string) => void;
}

const CategorySection = ({
  category,
  channels,
  serverId,
  selectedChannel,
  isExpanded,
  onToggleCategory,
  onChannelSelect,
  onCreateChannel,
}: CategorySectionProps) => {
  const categoryChannels = channels.filter(
    (ch) => ch.categoryId === category.id && ch.serverId === serverId
  );

  const handleChannelClick = (channel: ChannelType) => {
    onChannelSelect(channel);
  };

  return (
    <div className="px-1">
      <button
        onClick={() => onToggleCategory(category.id)}
        className="flex items-center hover:text-white text-xs uppercase text-left px-4 py-1 cursor-pointer group text-zinc-300 w-full"
      >
        {isExpanded ? (
          <ChevronDown className="text-gray-400 h-4" />
        ) : (
          <ChevronRight className="text-gray-400 h-4" />
        )}
        <span className="flex-1">{category.name}</span>
        <Plus
          className="hidden group-hover:block h-4"
          onClick={(e) => {
            e.stopPropagation();
            onCreateChannel(category.id);
          }}
        />
      </button>

      {isExpanded && (
        <div className="w-full mx-2 px-6">
          {categoryChannels.map((channel) => (
            <div key={channel.id} onClick={() => handleChannelClick(channel)}>
              <div
                className={`flex items-center h-7 rounded text-sm mb-2 text-gray-400 hover:bg-zinc-600 cursor-pointer px-2 ${selectedChannel?.id === channel.id
                    ? "bg-zinc-600 text-white"
                    : ""
                  }`}
              >
                {channel.type === "text" ? (
                  <Hash className="mr-2 h-4" />
                ) : (
                  <Volume2 className="mr-2 h-4" />
                )}
                <span>{channel.name}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategorySection;
