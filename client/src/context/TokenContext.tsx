import { createContext } from "react";

type ContextType = {
    token: string; 
    setToken: React.Dispatch<React.SetStateAction<string>>; 
}

export const TokenContext = createContext<ContextType | null>(null);

interface TokenProviderProps {
    children: React.ReactNode;
    token: string; 
    setToken: React.Dispatch<React.SetStateAction<string>>;
}
export const TokenProvider: React.FC<TokenProviderProps> = ({children, setToken, token}) => {
    return (
    <TokenContext.Provider value={{ token, setToken }}>
        {children}
    </TokenContext.Provider>
    )
        
}