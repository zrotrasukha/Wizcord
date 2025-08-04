import type { ChannelType } from "@/types/app.types";
import { Hash, Volume2 } from "lucide-react";

interface OrphanChannels {
  channels: ChannelType[];
  serverId: string;
  onChannelSelect: (channel: ChannelType) => void;
  selectedChannel: ChannelType | null;
}
export const OrphanChannels = ({ channels, serverId, onChannelSelect, selectedChannel }: OrphanChannels) => {

  const handleChannelClick = (channel: ChannelType) => {
    onChannelSelect(channel);
  }
  const orphanChannels = channels.filter((ch) => !ch.categoryId && ch.serverId === serverId)
  return (
    <>
      {/* orphan channels */}
      {orphanChannels.length > 0 && (
        <div>
          <h4 className="text-xs uppercase text-zinc-400 px-4 py-2">Orphan Channels</h4>
          {orphanChannels.map((ch) => (
            <div key={ch.id}
              onClick={() => handleChannelClick(ch)}
              className="w-full px-4"
            >
              <div className={`flex items-center h-7 rounded text-sm mb-2 text-gray-400 hover:bg-zinc-600 cursor-pointer px-2 ${selectedChannel?.id === ch.id ? 'bg-zinc-600 text-white' : ''}`}>
                {ch.type === 'text' ?
                  <Hash className="mr-2 h-4" /> :
                  <Volume2 className="mr-2 h-4" />}
                <span>{ch.name}</span>
              </div>
            </div>
          ))}
        </div>
      )
      }
    </>
  )
};
