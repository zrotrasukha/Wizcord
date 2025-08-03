import type { ApiType } from "@/lib/api";
import { fakeChannels } from "@/lib/mock";
import type { ChannelType } from "@/types/app.types";
import { useCallback, useEffect, useState } from "react";

export const useChannels = (api: ApiType, token: string) => {
  const [channels, setChannels] = useState<ChannelType[]>(fakeChannels);
  const [loadingChannels, setLoadingChannels] = useState(false);

  const fetchChannels = useCallback(async () => {
    try {
      const channels = await api.server.getservers.$get();
      if (!channels.ok) {
        console.error("Failed to fetch channels",);
        return [];
      }
      const data = await channels.json();
      if (data && typeof data === 'object' && 'channels' in data && Array.isArray(data.channels)) {
        return data.channels as ChannelType[];
      }
      console.error("Unexpected response format:", data);
      return [];
    } catch (err) {
      console.error("Error fetching channels:", err);
      return [];
    }
  }, [api, token]);

  useEffect(() => {
    if (!token) return;
    setLoadingChannels(true);
    const loadChannels = async () => {
      const fetchedChannels = await fetchChannels();
      setChannels(fetchedChannels);
      setLoadingChannels(false);
    }
    loadChannels();
  }, [token, api]);
  return {
    channels,
    loadingChannels,
    setChannels
  }
}
