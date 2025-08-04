import type { ServerType } from "@/types/app.types";
import { FaCirclePlus as Plus } from "react-icons/fa6";
import { ServerList } from '@/components/serverList'


interface sideBarProps {
  servers: ServerType[] | null;
  setShowServerDialogue: React.Dispatch<React.SetStateAction<boolean>>;
  selectedServer?: string
}

export default function sidebar({ servers, setShowServerDialogue, selectedServer }: sideBarProps) {
  return (

    <div className='py-2 flex flex-col h-screen w-[65px] bg-zinc-600 left-0  overflow-hidden'>
      {/* Plus icon */}
      <button className='mb-2 w-full h-14 bg-transparent flex items-center justify-center p-0 '
        onClick={() => setShowServerDialogue(true)}>
        <Plus size={42} className='text-white hover:text-blue-400 transition-all duration-200 cursor-pointer' />
      </button>
      <div className='h-[2px] w-3/4 place-self-center bg-white rounded-2xl mb-3 ' />
      {/* server list*/}
      <ServerList servers={servers} selectedServer={selectedServer || ""} />
    </div>
  )
}
