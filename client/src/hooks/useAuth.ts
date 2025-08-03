import { useAuth } from "@clerk/clerk-react";
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const useAuthToken = () => {
  const [token, setToken] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { getToken, isSignedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isSignedIn) {
      navigate({ to: '/signin' });
      setIsLoading(false);
      return;
    }

    const fetchToken = async () => {
      try {
        setIsLoading(true);
        const fetchedToken = await getToken({});
        setToken(fetchedToken || '');
      } catch (error) {
        console.error('Error fetching token:', error);
        setToken('');
      } finally {
        setIsLoading(false);
      }
    };

    fetchToken();
  }, [getToken, isSignedIn, navigate]);

  return { token, setToken, isLoading, isSignedIn };
}
