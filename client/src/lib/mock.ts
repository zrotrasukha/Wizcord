import type { Category, ChannelType, MessageType } from "@/types/app.types";

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


export const mockMessages: MessageType[] = [
  {
    id: 'msg-1',
    content: 'yo what’s up',
    author: 'shivang',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1), // 1 hour ago
    channelId: '1', // general
  },
  {
    id: 'msg-2',
    content: 'did you deploy the build?',
    author: 'elon',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    channelId: '1', // general
  },
  {
    id: 'msg-3',
    content: 'production is 🔥 again',
    author: 'grug',
    timestamp: new Date(Date.now() - 1000 * 60 * 20), // 20 mins ago
    channelId: '2', // random
  },
  {
    id: 'msg-4',
    content: 'bruh it crashed again',
    author: 'cat_gpt',
    timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 mins ago
    channelId: '2', // random
  },
  {
    id: 'msg-5',
    content: 'lol nice try',
    author: 'hackerMan',
    timestamp: new Date(), // now
    channelId: '4', // announcements
  },
]
