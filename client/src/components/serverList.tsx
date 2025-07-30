import type { ServerType } from "@/types/app.types";

interface ServerListProps {
  servers: ServerType[] | null;
}


export const ServerList: React.FC<ServerListProps> = ({ servers }) => {
  return (
    <div>
      {servers?.map((server) => {
        return (
          <div key={server.id} className='w-full h-14  flex items-center justify-center p-0 hover:bg-zinc-800 transition-colors cursor-pointer '>
            {server.icon ? (
              <img
                src={server.icon}
                alt={server.name}
                className='w-8 h-8 rounded-full object-cover'
              />
            ) : (
              <button className='w-12 h-12 bg-zinc-500 rounded-full flex items-center justify-center'>
                <span className='text-white text-xs font-bold'>
                  {server.name.charAt(0).toUpperCase()}
                </span>
              </button>
            )}
          </div>
        )
      })}
    </div>
  )
}