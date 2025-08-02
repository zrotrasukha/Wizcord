
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
  id: string;
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
  server: ServerType | null;
  selectedChannel: ChannelType | null;
  onChannelSelect: (channel: ChannelType) => void;
  channels: ChannelType[];
  setChannels: React.Dispatch<React.SetStateAction<ChannelType[]>>;
}


export interface CreateChannelDialogueProps {
  onComplete: () => void; 
  onCancel: () => void;
  categoryId?: string; // Optional! If provided = assign to category, if not = orphan
  serverId: string;
  onChannelCreate: (channel: ChannelType) => void;
}