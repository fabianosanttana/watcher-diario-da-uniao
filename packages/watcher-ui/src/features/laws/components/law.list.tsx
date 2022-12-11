import { Box, Heading, Spinner } from '@primer/react'
import { useContext } from 'react'
import LawContext from '../context/law.context'
import { LawItem } from './law.item'

const LawList = () => {
  const { laws, isLoading } = useContext(LawContext)

  return (
    <div>
      <Heading sx={{ fontSize: 4, mb: 2 }}>Consultas em monitoramento</Heading>
      <Box display={'grid'} style={{ rowGap: 24 }}>
        {isLoading && <Spinner />}
        {!isLoading && laws?.map((law) => <LawItem key={law.id} law={law} />)}
      </Box>
    </div>
  )
}

export default LawList
