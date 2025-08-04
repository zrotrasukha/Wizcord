import { useMemo } from "react";
import { useAuthToken } from "./useAuth";
import { createApi } from "@/lib/api";

export const useApi = () => {
  const { token } = useAuthToken();
  const api = useMemo(() => token ? createApi(token) : null, [token]);
  return api;
}
