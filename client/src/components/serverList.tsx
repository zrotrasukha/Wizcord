import type { ServerType } from "@/types/app.types";
import { useNavigate } from "@tanstack/react-router";

interface ServerListProps {
  servers: ServerType[] | null;
  selectedServer: string;
}


export const ServerList: React.FC<ServerListProps> = ({ servers, selectedServer }) => {
  const navigate = useNavigate();
  return (
    <div>
      {servers?.map((server) => {
        const isActive = server.id === selectedServer;
        return (
          <div key={server.id} className={`w-full h-14  flex items-center justify-center p-0 hover:bg-zinc-800 transition-colors cursor-pointer group 
${isActive ? 'bg-zinc-800' : 'bg-zinc-700'}`}
            onClick={() => {
              navigate({ to: `/server/${server.id}` });
              localStorage.setItem('selectedServer', server.id);
            }}>
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
