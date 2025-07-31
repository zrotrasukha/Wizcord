import SelectFieldTab from '@/components/selectFieldTab'
import { Button } from '@/components/ui/button'
import { Card, CardFooter, } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createApi } from '@/lib/api'
import { useAuth } from '@clerk/clerk-react'
import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { TokenContext } from '@/routes'
import { RxCross2 as Cross } from "react-icons/rx";
import type { ServerType } from '@server/src/types/server.type'

type ServerDialogueProps = {
  onComplete: () => void;
  setShowServerDialogue: React.Dispatch<React.SetStateAction<boolean>>;
  onCancel: () => void;
}

export default function ServerDialogue({ onComplete, setShowServerDialogue, onCancel}: ServerDialogueProps) {

  const [tabField, setTabField] = useState('create');
  const [joinServerLink, setJoinServerLink] = useState('');
  const [servername, setservername] = useState('');
  const [loading, setLoading] = useState(false);
  const { getToken, isSignedIn } = useAuth();
  const ctx = useContext(TokenContext);

  if (!ctx) throw new Error('TokenContext is not provided');
  const { token, setToken } = ctx;

  const api = useMemo(() => {
    return token ? createApi(token) : null;
  }, [token]);

  const handleBackgroundClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onComplete();
    }
  }, [onComplete]);

  const handleCreateServer = useCallback(async () => {
    if (!api) return;
    try {
      setLoading(true);
      const response = await api.server.create.$post({
        json: {
          name: servername,
        }
      })
      if (response.ok) {
        onComplete();
      } else {
        console.error('Failed to create server:');
      }
    } catch (error) {
      console.log('Error creating server:', error);
    } finally {
      setLoading(false);
    }

  }, [api, servername, onComplete]);

  const getServers = useCallback(async () => {
    const fetchServers = async () => {
      if (!api) return [];
      try {
        const serversRes = await api.server.getservers.$get();
        if (!serversRes.ok) {
          console.error('Failed to fetch servers:', serversRes.statusText);
          return [];
        }
        const servers = (await serversRes.json()) as { Servers: ServerType[] };
        console.log('Fetched servers:', servers);
      } catch (error) {
        console.log('Error fetching servers:', error);
      }
    }
    fetchServers();
  }, [api]);

  useEffect(() => {
    if (!token && isSignedIn) {
      const fetchToken = async () => {
        try {
          const newToken = await getToken();
          setToken(newToken || '');
        } catch (error) {
          console.error('Error fetching token:', error);
        }
      }
      fetchToken();
    }

  }, [token, isSignedIn, getToken, setToken]);

  return (
    <div className='inset-0 fixed bg-black/50 flex justify-center items-center z-50'
      onClick={handleBackgroundClick}>
      <Card className='flex flex-col w-[400px] h-fit justify-center items-center relative'>
        <Cross
          className="absolute top-5 right-5 cursor-pointer text-gray-400 hover:text-white transition-colors z-10"
          size={20}
          onClick={() => setShowServerDialogue(false)}
        />
        <Button onClick={getServers}>getServers</Button>
        <SelectFieldTab value={tabField} onValueChange={setTabField} />
        {tabField === 'create' ? (
          <div className='w-full px-4'>
            <Label
              htmlFor='server-name'
              className='font-semibold  pb-2'
            >
              Please fill your legendary server name
            </Label>
            <Input
              value={servername}
              onChange={(e) => setservername(e.target.value)}
              id='server-name'
              placeholder='Enter server name'
              className='italic' />
            <CardFooter className='flex w-full items-center justify-end p-0 mt-2 gap-2'>
              <Button 
                variant="outline"
                className="w-1/2"
                onClick={onCancel}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateServer}
                disabled={loading || !servername.trim()}
                className="w-1/2"
              >
                {loading ? 'Creating...' : 'Create'}
              </Button>
            </CardFooter>
          </div>
        ) : (
          <div className='w-full px-4'>
            <Label htmlFor='join-link' className='font-semibold  pb-2'>Enter server invite link</Label>
            <Input
              value={joinServerLink}
              onChange={(e) => setJoinServerLink(e.target.value.replace(/\s/g, ''))}
              id='join-link'
              placeholder='Enter invite link'
              className='italic'
            />
            <CardFooter className='flex w-full items-center justify-end p-0 mt-2 gap-2'>
              <Button 
                variant="outline"
                className="w-1/2"
                onClick={onCancel}
              >
                Cancel
              </Button>
              <Button 
                disabled={!joinServerLink}
                className='w-1/2'
              >
                Join
              </Button>
            </CardFooter>
          </div>
        )}
      </Card >
    </div >
  )
}
