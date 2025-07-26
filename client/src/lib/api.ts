import { hc } from 'hono/client';
import type { appType } from "@server/app";

export const createApi = (token: string | null) => {
    return hc<appType>('http://localhost:4000/', {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    }).api;
}
