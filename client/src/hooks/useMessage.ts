import { useState, useEffect } from 'react'
import type { MessageType, ChannelType } from '@/types/app.types'

export function useMessages(selectedChannel: ChannelType | null) {
  const [messages, setMessages] = useState<MessageType[]>([])

  // Optional: fetch initial messages if you plan to load from server later
  useEffect(() => {
    if (!selectedChannel) {
      setMessages([])
      return
    }

    // Later: replace this with real fetch logic
    const mockMessages: MessageType[] = [
      {
        id: 'm1',
        content: 'Welcome to ' + selectedChannel.name,
        author: 'system',
        timestamp: new Date(),
        channelId: selectedChannel.id,
      },
    ]
    setMessages(mockMessages)
  }, [selectedChannel])

  const sendMessage = (message: string) => {
    if (!selectedChannel) return

    const newMessage: MessageType = {
      id: Math.random().toString(36).substring(2, 15),
      content: message,
      author: ['shivang', 'elon', 'grug', 'cat_gpt', 'hackerMan'][Math.floor(Math.random() * 5)],
      timestamp: new Date(),
      channelId: selectedChannel.id,
    }

    setMessages((prev) => [...prev, newMessage])

    // 🔥 Later: send to your backend/server
    // sendToServer(newMessage)
  }

  return {
    messages,
    sendMessage,
    setMessages, // if you want to mutate externally (e.g. after fetching from backend)
  }
}
