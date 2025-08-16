import { SendHorizonal, Volume2 } from 'lucide-react';
import { useRef, useState, type FormEvent } from 'react';
import { type MessageType } from '@/types/app.types'
import type { channelType } from '@shared/app.type';

interface ChatBoxProps {
    selectedChannel: channelType | null;
    messages: MessageType[]
    onSendMessage: (message: string) => void;
}
export default function ChatBox({ selectedChannel, messages, onSendMessage }: ChatBoxProps) {
    const [message, setMessage] = useState('');
    const divRef = useRef<HTMLDivElement>(null);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setMessage("");
        if (divRef.current) divRef.current.innerText = '';
        if (message.trim() === '') return;
        onSendMessage(message);
    }

    const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
        const text = e.currentTarget.innerText;
        setMessage(text.trim());
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e as unknown as React.FormEvent);
        }
    };

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
        <div className='flex-1 flex flex-col bg-stone-800 rounded-l-xl ml-2 overflow-hidden'>
            {/* Messages Area */}
            <div className='flex-1 overflow-scroll flex flex-col-reverse'>
                <ol>
                    {
                        messages.filter((msg) => msg.channelId === selectedChannel?.id)
                            .map((msg) => (
                                <li key={msg.id} className='p-2 hover:bg-zinc-700 mb-2'>
                                    <p className='text-white font-semibold'>{msg.author}</p>
                                    <p className='text-gray-300 whitespace-pre-wrap wrap-break-word'>{msg.content}</p>
                                    <span className='text-xs text-gray-500'>{new Date(msg.timestamp).toLocaleTimeString()}</span>
                                </li>
                            ))
                    }
                </ol>
            </div>
            <form
                onSubmit={handleSubmit}
                className='border border-zinc-400 min-h-12 rounded-md mb-4 mx-2 flex items-center text-white group focus-within:border-zinc-200 transition-colors duration-200'
            >
                <div className='flex-1'>
                    {!message &&
                        <div className='text-zinc-400 select-none absolute mx-4 my-2 text-sm'
                            aria-hidden="true"
                        >
                            Type your message here...
                        </div>}
                    <div
                        ref={divRef}
                        className='text-sm whitespace-pre-wrap wrap-break-word flex-1 outline-none px-4 py-2 relative z-10 max-h-[40vh] overflow-scroll scroll-pb-2'
                        role='textarea'
                        aria-multiline="true"
                        aria-invalid="false"
                        spellCheck="true"
                        autoCorrect="off"
                        contentEditable="true"
                        suppressContentEditableWarning
                        onInput={handleInput}
                        onKeyDown={handleKeyDown}
                    ></div>
                </div>
                <div className='h-full flex py-3'>
                    <div className='border border-zinc-400 h-6 mr-4'></div>
                    <button
                        type='submit'
                        disabled={!message}
                        className={`h-fit flex items-center justify-center group mr-4
                    ${message ? "text-blue-400 cursor-pointer" : "text-zinc-400 cursor-not-allowed"}`}>
                        <SendHorizonal className='transition-colors duration-200' />
                    </button>
                </div>
            </form>
        </div >
    )
}
