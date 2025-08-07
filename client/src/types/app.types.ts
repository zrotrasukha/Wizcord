import type { channelType } from "@shared/app.type";

export type ServerType = {
  name: string;
  icon: string | null;
  description: string | null;
  id: string;
  createdAt: Date | null;
  updatedAt: Date | null;
  admin: string;
}


export interface Category {
  id: string
  name: string;
  serverId: string;
}

export interface ChannelType {
  id: string;
  name: string;
  type: string;
  serverId: string;
  categoryId: string;
}

export interface MessageType {
  id: string;
  content: string;
  author: string;
  timestamp: Date;
  channelId: string;
}


export interface SecondSidebarProps {
  serverId: string;
  selectedChannel: channelType | null;
  onChannelSelect: (channel: channelType) => void;
  setChannels: React.Dispatch<React.SetStateAction<channelType[]>>;
}


export interface CreateChannelDialogueProps {
  onComplete: () => void;
  onCancel: () => void;
  categoryId?: string; // Optional! If provided = assign to category, if not = orphan
  serverId: string;
  onChannelCreate: (channel: channelType) => void;
}
