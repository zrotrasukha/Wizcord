import { hc } from 'hono/client';
import type { appType } from "@server/app";
import { useAuth } from '@clerk/clerk-react';

// export const createApi = (token: string | null) => {
//     return hc<appType>('http://localhost:4000/', {
//         headers: {
//             Authorization: `Bearer ${token}`,
//         }
//     }).api;
// }
// 

export const createApi = async () => {
    const auth = useAuth();
    const token = await auth.getToken();
    return hc<appType>('http://localhost:4000/', {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    }).api;
    
}
