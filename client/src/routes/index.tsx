import { createFileRoute } from '@tanstack/react-router'
import '../index.css'
import { useAuth } from '@clerk/clerk-react'
import { createApi } from '@/lib/api';
export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  const auth = useAuth();
  
  const copyToken = async () => {
    const token = await auth.getToken();
    if (token) {
      navigator.clipboard.writeText(token);
      alert('Token copied to clipboard');
    }
    else {
      alert('No token found');
    }
  }
  
  const getservers = async () => {
    const api = createApi(await auth.getToken());
    const response = await api.server.getservers.$get();
    console.log(await response.json());
  }

  return <>
    <div className="h-screen w-screen bg-blue-900 flex flex-col items-center justify-center ">
      <button className='bg-blue-500 text-white p-2 rounded' onClick={copyToken}>Copy Token</button>
      <button className='bg-blue-500 text-white p-2 rounded' onClick={getservers}>Test</button>
    </div>
  </>
}
