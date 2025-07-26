
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import '../index.css'
import { SignedIn, SignedOut, useAuth } from '@clerk/clerk-react'
import { createApi } from '@/lib/api';
import { useEffect } from 'react';
export const Route = createFileRoute('/token')({
  component: RouteComponent,
})

function RouteComponent() {
  const { getToken, isSignedIn, isLoaded} = useAuth();
  
  const copyToken = async () => {
    const token = await getToken();
    if (token) {
      navigator.clipboard.writeText(token);
      alert('Token copied to clipboard');
    }
    else {
      alert('No token found');
    }
  }

  const navigate = useNavigate();
  useEffect(() => {
    if(!isLoaded) return; 
    if(!isSignedIn){
      navigate({ to: '/signin' });
      return;
    }
    return;
  }, [isSignedIn, isLoaded])

  const getservers = async () => {
    const api = createApi(await getToken());
    const response = await api.server.getservers.$get();
    console.log(await response.json());
  }

  return <>
    <SignedIn>
      <div className="h-screen w-screen bg-blue-900 flex flex-col items-center justify-center ">
        <button className='bg-blue-500 text-white p-2 rounded' onClick={copyToken}>Copy Token</button>
        <button className='bg-blue-500 text-white p-2 rounded' onClick={getservers}>Test</button>
      </div>
    </SignedIn>
    <SignedOut>
      <p>redirecting to signin ...</p>
    </SignedOut>
  </>
}
