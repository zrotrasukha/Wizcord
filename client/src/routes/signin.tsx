import { SignedOut, SignIn, useAuth } from '@clerk/clerk-react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react';

export const Route = createFileRoute('/signin')({
  component: RouteComponent,
})


function RouteComponent() {
  const {isSignedIn} = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if(isSignedIn){
      navigate({ to: '/' });
      return; 
    }
  }, [isSignedIn])
  return (
    <SignedOut>
      <SignIn />
    </SignedOut>
  )
}
