import type { ApiType } from "@/lib/api";
import { fakeChannels } from "@/lib/mock";
import type { ChannelType } from "@/types/app.types";
import { useCallback, useEffect, useState } from "react";

interface useChannelProps {
  api: ApiType | null;
  token: string;
}
//@ts-ignore
export const useChannels = ({ api, token }: useChannelProps) => {
  const [channels, setChannels] = useState<ChannelType[]>(fakeChannels);
  const [loadingChannels, setLoadingChannels] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState<ChannelType | null>(null);
  return {
    channels,
    loadingChannels,
    setChannels,
    selectedChannel,
    setSelectedChannel,
  }
}
