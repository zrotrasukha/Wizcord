
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
  type: 'text' | 'voice';
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
