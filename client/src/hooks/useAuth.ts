import { useAuth } from "@clerk/clerk-react";
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const useAuthToken = () => {
  const [token, setToken] = useState('');
  const { getToken, isSignedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isSignedIn) {
      navigate({ to: '/signin' });
    }
    const fetchToken = async () => {
      const token = await getToken();
      setToken(token || '');
    }

    fetchToken();
  }, [getToken, isSignedIn, navigate])

  return token
}
