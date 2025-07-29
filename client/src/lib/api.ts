import { hc } from 'hono/client';
import type { appType } from "@server/app";
import { useAuth } from '@clerk/clerk-react';
import { useCallback } from 'react';

export const createApi = (token: string | null) => {
    return hc<appType>('http://localhost:4000/', {
        headers: {
            authorization: `bearer ${token}`,
        }
    }).api;
}


export const useHonoApi = () => {
    const { getToken, isSignedIn } = useAuth();

    const makeRequest = useCallback(
        async <T>(
            apiCall: (api: ReturnType<typeof createApi>) => Promise<T>,
            retryCount = 0
        ): Promise<T> => {
            if (!isSignedIn) {
                throw new Error('User is not signed in');
            }
            try {
                const token = await getToken();
                const api = createApi(token);
                return await apiCall(api);
            } catch (error: any) {
                if (error.status == 401 && retryCount === 0) {
                    await new Promise(resolve => setTimeout(() => resolve, 1000));
                    const freshToken = await getToken();
                    const api = createApi(freshToken);
                    return await apiCall(api);
                }
                throw error;
            }
        },

        [getToken, isSignedIn]);

    return { makeRequest };
}

