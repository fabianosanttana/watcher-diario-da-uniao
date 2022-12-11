import { createContext } from 'react'
import useLaws from '../hooks/useLaws'

type LawContextType = ReturnType<typeof useLaws>

const LawContext = createContext<LawContextType>({} as LawContextType)

export default LawContext
