import useLaws from '../hooks/useLaws'
import LawContext from './law.context'
import React from 'react'

interface LawProviderProps {
  children: React.ReactNode
}

export const LawProvider: React.FC<LawProviderProps> = ({ children }) => {
  const law = useLaws()

  return <LawContext.Provider value={law}>{children}</LawContext.Provider>
}
