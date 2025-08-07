import { useState, useEffect } from 'react'
import type { MessageType } from '@/types/app.types'
import type { channelType } from '@shared/app.type'

export function useMessages(selectedChannel: channelType | null) {
  const [messages, setMessages] = useState<MessageType[]>([])

  useEffect(() => {
    if (!selectedChannel) {
      setMessages([])
      return
    }

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

  const sendMessageHandler = (message: string) => {
    if (!selectedChannel) return

    const newMessage: MessageType = {
      id: Math.random().toString(36).substring(2, 15),
      content: message,
      author: ['shivang', 'elon', 'grug', 'cat_gpt', 'hackerMan'][Math.floor(Math.random() * 5)],
      timestamp: new Date(),
      channelId: selectedChannel.id,
    }

    setMessages((prev) => [...prev, newMessage])
  }

  return {
    messages,
    sendMessageHandler,
    setMessages,
  }
}
