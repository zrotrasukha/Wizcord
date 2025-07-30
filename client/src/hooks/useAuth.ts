import { useAuth } from "@clerk/clerk-react";
import { useEffect, useState } from "react";

export const useAuthToken = () => {
    const { getToken, isSignedIn } = useAuth();
    const [token, setToken] = useState<string>('');

    useEffect(() => {
        const fetchToken = async () => {
            const token = await getToken();
            setToken(token || '');
        }
        fetchToken();
    }, [getToken, isSignedIn])
    
    return { token, setToken };
}