import {
  Box,
  Heading,
  Text,
  Button,
  IconButton,
  BranchName,
  Popover,
  Spinner,
  CounterLabel,
  Dialog,
  FilterList
} from '@primer/react'
import React, { useContext } from 'react'
import LawContext from '../context/law.context'
import { LawResponse } from '../interfaces/law-response.interface'
import { LinkExternalIcon, EyeIcon } from '@primer/octicons-react'
import LawItemTags from './law.item.tags'
import { dateToBr } from '../../../core'
import LawItemArchive from './law.item.archive'
import LawItemFormSubscriber from './law.item.form'

export interface LawItemProps {
  law: LawResponse
}

export const LawItem: React.FC<LawItemProps> = ({ law }) => {
  const {
    loadLaw,
    law: lawData,
    deleteLaw,
    currentLawId,
    isLoadingLaw,
    subscribeToLaw,
    isSubscribing
  } = useContext(LawContext)
  const [open, setOpen] = React.useState(false)
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const returnFocusRef = React.useRef(null)

  const handleLoadLaw = () => {
    loadLaw(law.id)
  }

  const handleCloseLaw = () => {
    loadLaw('')
  }

  const isLoaded = currentLawId === law.id

  const handleDeleteLaw = async () => {
    try {
      await deleteLaw(law.id)
    } catch (error) {
      console.error(error)
    }
  }

  const handleSubscribe = async (subscriber: string) => {
    try {
      await subscribeToLaw({ id: law.id, email: subscriber })
      setDialogOpen(false)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Box
      key={law.id}
      p={2}
      borderWidth={1}
      borderStyle="dashed"
      borderRadius={8}
      borderColor="rgba(0, 0, 0, .3)"
      width={'full'}
      display={'grid'}
      style={{ rowGap: 8 }}
    >
      <Box
        display={'flex'}
        alignItems="center"
        justifyContent={'space-between'}
        style={{ columnGap: 8 }}
      >
        <div>
          <Heading sx={{ fontSize: 2 }}>
            {!law.title ? 'Consulta sem título' : law.title}
            {law.hasUpdatedWithinLastTwoDays && (
              <BranchName style={{ marginLeft: 5 }}>
                {' '}
                (Atualizado recentemente)
              </BranchName>
            )}
            {!law.hasUpdatedWithinLastTwoDays && (
              <BranchName
                style={{
                  marginLeft: 5,
                  backgroundColor: '#e6e8e9',
                  color: '#727272'
                }}
              >
                {' '}
                (Atualizado em {dateToBr(law.updatedAt)})
              </BranchName>
            )}
          </Heading>
          <Heading sx={{ fontSize: 1, opacity: '.5' }}>
            Consulta criada em: {dateToBr(law.createdAt)}
          </Heading>
        </div>
        <a href={law.url} target="_blank" rel="noreferrer">
          <IconButton
            aria-label="Search"
            icon={LinkExternalIcon}
            size="small"
          />
        </a>
      </Box>

      {law.lastScrape && (
        <Box
          p={2}
          borderWidth={1}
          borderStyle="dashed"
          borderRadius={8}
          borderColor="border.default"
          width={'full'}
          background="rgb(246, 248, 250)"
        >
          <Heading sx={{ fontSize: 1, opacity: '.6' }}>
            Última verificação: {dateToBr(law.lastScrape?.date)}
          </Heading>
          <Heading sx={{ fontSize: 1, opacity: '.6' }}>
            Total de resultados: {law.lastScrape?.totalResults}
          </Heading>
        </Box>
      )}
      <LawItemTags params={law.params} />
      <Box display={'flex'} style={{ columnGap: 8 }}>
        {!isLoaded && (
          <Button onClick={handleLoadLaw} variant="primary">
            Ver resultados
          </Button>
        )}
        {isLoaded && (
          <Button onClick={handleCloseLaw} variant="outline">
            Recolher resultados
          </Button>
        )}
        <Box position="relative">
          <Button variant="danger" onClick={() => setOpen(!open)}>
            Remover
          </Button>
          <Popover open={open} caret={'top-left'}>
            <Popover.Content>
              <Text as="p">Esta ação não poderá ser desfeita</Text>
              <Button variant="danger" onClick={handleDeleteLaw}>
                Tenho certeza
              </Button>
            </Popover.Content>
          </Popover>
        </Box>
        <Box position="relative">
          <Button
            variant="default"
            leadingIcon={EyeIcon}
            onClick={() => setDialogOpen(true)}
            ref={returnFocusRef}
          >
            Receber atualizações{' '}
            <CounterLabel>{law.observers.length}</CounterLabel>
          </Button>
        </Box>
      </Box>

      {isLoaded && (
        <Box
          p={2}
          borderWidth={1}
          borderStyle="dashed"
          borderRadius={8}
          borderColor="border.default"
          width={'full'}
          display={'grid'}
          style={{ rowGap: 16 }}
        >
          {isLoadingLaw && <Spinner />}
          {!isLoadingLaw &&
            lawData?.archives?.map((archive) => (
              <LawItemArchive key={archive.url} archive={archive} />
            ))}
        </Box>
      )}

      <Dialog
        returnFocusRef={returnFocusRef}
        isOpen={dialogOpen}
        onDismiss={() => setDialogOpen(false)}
        aria-labelledby="header-id"
      >
        <Dialog.Header id="header-id">
          Receber atualizações por email
        </Dialog.Header>
        <LawItemFormSubscriber
          addSubscriber={handleSubscribe}
          isSubscribing={isSubscribing}
        />
        {law.observers.length > 0 && (
          <Box
            p={2}
            borderWidth={1}
            borderStyle="dashed"
            borderColor="border.default"
            width={'full'}
          >
            <FilterList>
              {law.observers.map((observer) => (
                <FilterList.Item href="#" key={observer}>{observer}</FilterList.Item>
              ))}
            </FilterList>
          </Box>
        )}
      </Dialog>
    </Box>
  )
}
