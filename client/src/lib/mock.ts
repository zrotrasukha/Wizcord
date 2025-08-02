import type { Category, ChannelType } from "@/types/app.types";

export const Categories: Category[] = [
  { id: 'cat1', name: 'Text Channels', serverId: "03e64685-b993-4f3d-9c9c-26bc24ae2e15" },
  { id: 'cat2', name: 'Voice Channels', serverId: "03e64685-b993-4f3d-9c9c-26bc24ae2e15" },
  { id: 'cat3', name: 'General', serverId: "b1e2c3d4-e5f6-7890-abcd-1234567890ef" }
];

export const fakeChannels: ChannelType[] = [
  { id: '1', name: 'general', type: 'text', serverId: "03e64685-b993-4f3d-9c9c-26bc24ae2e15", categoryId: 'cat1' },
  { id: '2', name: 'random', type: 'text', serverId: "03e64685-b993-4f3d-9c9c-26bc24ae2e15", categoryId: 'cat1' },
  { id: '3', name: 'music', type: 'voice', serverId: "03e64685-b993-4f3d-9c9c-26bc24ae2e15", categoryId: 'cat2' },
  { id: '4', name: 'announcements', type: 'text', serverId: "b1e2c3d4-e5f6-7890-abcd-1234567890ef", categoryId: 'cat3' },
  { id: '5', name: 'lounge', type: 'voice', serverId: "b1e2c3d4-e5f6-7890-abcd-1234567890ef", categoryId: 'cat3' }
]
