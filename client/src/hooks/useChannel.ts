import type { ApiType } from "@/lib/api";
import { useCallback, useEffect, useState } from "react";
import type { channelType, CreateChannelType } from '@shared/app.type'

interface useChannelProps {
  api: ApiType | null;
  serverId: string | undefined;
  token: string;
}

export const useChannel = ({ api, serverId, token }: useChannelProps) => {
  const [channels, setChannels] = useState<channelType[]>([]);
  const [loadingChannels, setLoadingChannels] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState<channelType | null>(null);

  // fetching channels with serverId as a query parameter
  //NOTE: usecallback will prevent unnecessary re-renders or go into oblivion
  const fetchChannels = useCallback(async () => {
    if (!api || !token || !serverId) return [];

    try {
      const res = await api.channel.all.$get({
        query: { serverId }
      })
      if (!res.ok) {
        console.error('Failed to fetch channels:', res.statusText);
        return [];
      }

      const data = await res.json();

      if (data && typeof data === 'object' && 'channels' in data && Array.isArray(data.channels)) {
        return data.channels as channelType[];
      }

      console.error('Unexpected response while fetching channels');
      return [];
    } catch (error) {
      console.error('Error fetching channels:', error);
      return [];
    }
  }, [api, token, serverId]);

  useEffect(() => {
    if (!token || !serverId) {
      setLoadingChannels(false);
      return;
    }

    setLoadingChannels(true);

    const loadChannels = async () => {
      const fetchedChannels = await fetchChannels();
      setChannels(fetchedChannels);
      setLoadingChannels(false);
    }

    loadChannels();
  }, [token, serverId, fetchChannels]);
  // NOTE: there is no need to put `api` in the dependency array here because it is already included in the `fetchChannels` function, which is memoized with `useCallback`.

  const refreshChannels = useCallback(async () => {
    if (!token || !serverId) return;
    const fetchedChannels = await fetchChannels();
    setChannels(fetchedChannels);
  }, [fetchChannels, token, serverId]);

  const createChannel = useCallback(
    async (newChannel: CreateChannelType)
      : Promise<channelType> => {
      if (!api || !token) {
        throw new Error('API or token not available');
      }

      try {
        const res = await api.channel.create.$post({
          json: {
            serverId: newChannel.serverId,
            name: newChannel.name,
            type: newChannel.type,
            categoryId: newChannel.categoryId || null,
            visibility: newChannel.visibility || 'public'
          },
        });

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error('error' in errorData && errorData.error || `Failed to create channel: ${res.statusText}`);
        }

        const data = await res.json();

        if (data && typeof data === 'object' && 'channel' in data) {
          return data.channel as channelType;
        }

        throw new Error('Unexpected response while creating channel');
      } catch (error) {
        console.error('Error creating channel:', error);
        throw error; // Re-throw so component can handle it
      }
    }, [api, token]);

  return {
    channels,
    loadingChannels,
    refreshChannels,
    createChannel,
    setLoadingChannels,
    setChannels,
    selectedChannel,
    setSelectedChannel,
  }
}
