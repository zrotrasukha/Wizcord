import SelectFieldTab from '@/components/ui/selectFieldTab'
import { Button } from '@/components/ui/button'
import { Card, CardFooter, } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createApi } from '@/lib/api'
import { useAuth } from '@clerk/clerk-react'
import { useContext, useEffect, useState } from 'react'
import { TokenContext } from '@/routes'
import { RxCross2 as Cross} from "react-icons/rx";

type ServerDialogueProps = {
  onComplete: () => void;
  setShowServerDialogue: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ServerDialogue({ onComplete, setShowServerDialogue }: ServerDialogueProps) {

  const [tabField, setTabField] = useState('create');
  const [joinServerLink, setJoinServerLink] = useState('');
  const [servername, setservername] = useState('');
  const { getToken, isSignedIn } = useAuth();
  const ctx = useContext(TokenContext);

  if (!ctx) throw new Error('TokenContext is not provided');
  const { token, setToken } = ctx;

  //to fetch token from Clerk
  useEffect(() => {
    const fetchToken = async () => {
      const token = await getToken();
      setToken(token || '');
    }
    fetchToken();
  }, [getToken, isSignedIn]);


  // Function to get servers
  const getServers = async () => {
    const api = createApi(token)
    const response = await api.server.getservers.$get();
    console.log(await response.json());

  }

  // For fetching if the user has 0 server then show the create server dialogue
  const handleCreateServer = async () => {
    const api = createApi(token);
    const response = await api.server.create.$post({
      json: {
        name: servername
      }
    });
    onComplete();
    console.log(await response.json());
  };
  return (
    <div className='bg-zinc-900 h-screen flex items-center justify-center'>
      <Card className='flex flex-col w-[400px] h-fit justify-center items-center relative'>
        <Cross 
          className="absolute top-5 right-5 cursor-pointer text-gray-400 hover:text-white transition-colors z-10" 
          size={20}
          onClick={() => setShowServerDialogue(false)} 
        />
        <Button onClick={getServers}>getServers</Button>
        <SelectFieldTab value={tabField} onValueChange={setTabField} className='' />
        {tabField === 'create' ? (
          <div className='w-full px-4'>
        <Label htmlFor='server-name' className='font-semibold  pb-2'>Please fill your legendary server name</Label>
        <Input value={servername} onChange={(e) => setservername(e.target.value)} id='server-name' placeholder='Enter server name' className='italic' />
        <CardFooter className='flex w-full items-center justify-end p-0 mt-2'>
          <Button onClick={handleCreateServer}>Create</Button>
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
        <CardFooter className='flex w-full items-center justify-end p-0 mt-2'>
          <Button>Join</Button>
        </CardFooter>
          </div>
        )}
      </Card >
    </div >
  )
}
