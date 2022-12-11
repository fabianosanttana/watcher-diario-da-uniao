import LawForm from './law.form'
import LawList from './law.list'
import React from 'react'
import { Box } from '@primer/react'
import { LawProvider } from '../context/law.provider'

const LawLayout: React.FC = () => {
  return (
    <LawProvider>
      <Box display={'grid'} style={{ rowGap: 40 }}>
        <LawForm />
        <LawList />
      </Box>
    </LawProvider>
  )
}

export default LawLayout
