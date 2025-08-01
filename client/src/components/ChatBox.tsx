import type { ChannelType } from '@/types/app.types';
import { Textarea } from './ui/textarea'
import { Send, Volume2 } from 'lucide-react';
import { useState } from 'react';
import { type MessageType } from '@/types/app.types'

interface ChatBoxProps {
  selectedChannel: ChannelType | null;
  messages: MessageType[]
  onSendMessage: (message: string) => void;
}
export default function ChatBox({ selectedChannel, messages, onSendMessage }: ChatBoxProps) {
  const [message, setMessage] = useState('');
  const handlePressEnter = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (message.trim() === '') return;

    if (e.key === "Enter" && !e.shiftKey) {
      if (message.trim() === '') return;
      onSendMessage(message);
    }
  }

  if (!selectedChannel) {
    return (
      <div className='flex-1 flex flex-col bg-stone-800 rounded-l-xl ml-2 my-[1px] border-l-zinc-700 border-[1px] items-center justify-center'>
        <p className='text-white italic '>No Channel selected</p>
      </div>
    )
  }

  if (selectedChannel && selectedChannel.type === 'voice') {
    return (

      <div className='flex-1 flex flex-col bg-stone-800 rounded-l-xl ml-2 my-[1px] border-l-zinc-700 border-[1px] items-center justify-center'>
        <Volume2 className='h-10 w-10 text-white' />
        <p className='text-white italic '>Voice Channel</p>
      </div>
    )
  }
  return (
    // Chat Box Container
    <div className='flex-1 flex flex-col bg-stone-800 rounded-l-xl ml-2 my-[1px] border-l-zinc-700 border-[1px]'>
      {/* Messages Area */}
      <div className=' flex-1 '>
        {
          messages.filter((msg) => msg.channelId === selectedChannel?.id)
            .map((msg) => (
              <div key={msg.id} className='p-2 border-b border-zinc-700'>
                <p className='text-white font-semibold'>{msg.author}</p>
                <p className='text-gray-300'>{msg.content}</p>
                <span className='text-xs text-gray-500'>{new Date(msg.timestamp).toLocaleTimeString()}</span>
              </div>
            ))
        }
      </div>
      {/* Text Area */}
      <div className=' flex  border-2 border-white'>
        <Textarea className='text-white placeholder:text-zinc-400'
          onKeyDown={handlePressEnter}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder='Write your message here...'
        />
        <button className='flex w-20 items-center justify-center group bg-white text-black hover:bg-black hover:text-white transition-colors'
        >
          <Send className='h-4' />
        </button>
      </div>
    </div>
  )
}
