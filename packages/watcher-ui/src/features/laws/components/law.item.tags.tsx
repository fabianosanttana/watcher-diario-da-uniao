import { LawResponseParams } from '../interfaces/law-response.interface'
import React from 'react'
import { Box, Label } from '@primer/react'

interface LawItemTagsProps {
  params: LawResponseParams
}

const LawItemTags: React.FC<LawItemTagsProps> = ({ params }) => {
  return (
    <Box display={'flex'} style={{ columnGap: 8, flexWrap: 'wrap' }}>
      {params?.query && (
        <Label variant="sponsors">Palavra-chave: {params?.query}</Label>
      )}
      {params?.mainOrganization && (
        <Label variant="done">
          Organização Principal: {params?.mainOrganization}
        </Label>
      )}
      {params?.subOrganization && (
        <Label variant="accent">
          Organização Secundária: {params?.subOrganization}
        </Label>
      )}
      {params?.actType && (
        <Label variant="success">Tipo de ato: {params?.actType}</Label>
      )}
    </Box>
  )
}

export default LawItemTags
