import { createFileRoute } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Card, CardFooter, } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from 'react'
import SelectFieldTab from '@/components/ui/selectFieldTab'
import { createApi } from '@/lib/api'
import { useAuth } from '@clerk/clerk-react'
// import {createServerSchema, type createServerType} from '../../../server/src/types/server.type'
export const Route = createFileRoute('/')({
  component: RouteComponent,
})
function RouteComponent() {
  const [tabField, setTabField] = useState('create');
  const [servername, setservername] = useState('');
  const [joinServerLink, setJoinServerLink] = useState('');
  const { getToken } = useAuth();

  const handleCreateServer = async () => {
    const api = createApi(await getToken());
    const response = await api.server.create.$post({
      json: {
        name: servername
      }
    });
    console.log(await response.json());
  };
  const getServers = async () => {
    const api = createApi(await getToken());
    // const response = await api.server.getservers.$get();
    const response = await api.server.getservers.$get();
    console.log(await response.json());


  }
  return (
    <div className='bg-zinc-900 h-screen flex items-center justify-center'>
      <Card className='flex flex-col w-[400px] h-fit justify-center items-center'>
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
        )
        }
      </Card >
    </div >
  )
}

