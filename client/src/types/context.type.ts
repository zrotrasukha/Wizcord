
export type channelCreateType = {
  categoryId?: string;
  serverId: string;
}
export type contextType = {
  token: string;
  setToken: React.Dispatch<React.SetStateAction<string>>;
  showChannelCreateDialogue: boolean,
  setShowChannelCreateDialogue: React.Dispatch<React.SetStateAction<boolean>>
  channelCreationContext: channelCreateType | null;
  setChannelCreationContext: React.Dispatch<React.SetStateAction<channelCreateType | null>>;

};
