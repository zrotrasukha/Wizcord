
export type contextType = {
  token: string;
  setToken: React.Dispatch<React.SetStateAction<string>>;
  showChannelCreateDialogue: boolean,
  setShowChannelCreateDialogue: React.Dispatch<React.SetStateAction<boolean>>
};
