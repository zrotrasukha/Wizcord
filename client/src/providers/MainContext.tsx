import type { contextType } from '@/types/context.type';
import { createContext } from 'react'


export const MainContext = createContext<contextType | null>(null);

export const MainContextProvider = ({ children, value }: { children: React.ReactNode, value: contextType }) => {

  return (
    <MainContext.Provider value={value}>
      {children}
    </MainContext.Provider>
  )
}
