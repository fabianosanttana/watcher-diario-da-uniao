import React, { useContext, useMemo } from 'react'
import {
  Box,
  Button,
  ButtonGroup,
  FormControl,
  Heading,
  SegmentedControl,
  TextInput
} from '@primer/react'
import { LinkExternalIcon, SingleSelectIcon } from '@primer/octicons-react'
import { extractParamsFromQuery } from '../utils/query'
import LawItemTags from './law.item.tags'
import LawContext from '../context/law.context'

const LawForm = () => {
  const { addLaw, isAdding } = useContext(LawContext)
  const [title, setTitle] = React.useState('')
  const [url, setUrl] = React.useState('')

  const queries = useMemo(() => extractParamsFromQuery(url), [url])

  const clearState = () => {
    setTitle('')
    setUrl('')
  }

  const handleAddLaw = async () => {
    try {
      await addLaw({ title, url, params: queries })
      clearState()
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div>
      <Heading sx={{ fontSize: 4, mb: 2 }}>Criar nova consulta</Heading>
      <SegmentedControl aria-label="Modo de criação">
        <SegmentedControl.Button defaultSelected leadingIcon={LinkExternalIcon}>
          Modo básico
        </SegmentedControl.Button>
        <SegmentedControl.Button leadingIcon={SingleSelectIcon} disabled>
          Por termos (em breve)
        </SegmentedControl.Button>
      </SegmentedControl>
      <div style={{ display: 'block', height: 10 }} />
      <Box display="grid" gridGap={3}>
        <FormControl>
          <FormControl.Label>Título da pesquisa</FormControl.Label>
          <TextInput
            block
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Digite um nome amigável para sua pesquisa"
          />
        </FormControl>
      </Box>
      <div style={{ display: 'block', height: 8 }} />
      <Box display="grid" gridGap={3}>
        <FormControl>
          <FormControl.Label>URL da pesquisa</FormControl.Label>
          <TextInput
            block
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Ex: https://www.in.gov.br/consulta/-/buscar/dou?q=+pronac&s=do1&exactDate=all&sortType=0"
          />
        </FormControl>
      </Box>
      {queries && (
        <div style={{ display: 'block', height: 20, marginTop: 10 }}>
          <LawItemTags params={queries} />
        </div>
      )}
      <div style={{ display: 'block', height: 10 }} />
      <Box>
        <ButtonGroup>
          <Button disabled={!url} onClick={clearState}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            disabled={!url || isAdding}
            onClick={handleAddLaw}
          >
            {!isAdding && 'Criar nova consulta'}
            {isAdding && 'Adicionando nova consulta...'}
          </Button>
        </ButtonGroup>
      </Box>
    </div>
  )
}

export default LawForm
