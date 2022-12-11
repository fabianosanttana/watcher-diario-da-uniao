import { Box, Button, FormControl, TextInput } from '@primer/react'
import React from 'react'

interface LawItemFormSubscriberProps {
  addSubscriber: (subscriber: string) => void
  isSubscribing: boolean
}

const LawItemFormSubscriber: React.FC<LawItemFormSubscriberProps> = ({
  addSubscriber,
  isSubscribing
}) => {
  const [subscriber, setSubscriber] = React.useState('')

  return (
    <Box p={3}>
      <Box display="grid" gridGap={3}>
        <FormControl>
          <FormControl.Label>
            Se inscreva para receber atualizações
          </FormControl.Label>
          <TextInput
            block
            value={subscriber}
            type="email"
            onChange={(e) => setSubscriber(e.target.value)}
            placeholder="Digite seu email"
          />
        </FormControl>
      </Box>
      <div style={{ display: 'block', height: 8 }} />
      <Box display="grid" gridGap={3}>
        <Button
          onClick={() => addSubscriber(subscriber)}
          disabled={isSubscribing || !subscriber.match(/.+@.+/)}
        >
          {isSubscribing && 'Adicionando email...'}
          {!isSubscribing && 'Adicionar email'}
        </Button>
      </Box>
    </Box>
  )
}

export default LawItemFormSubscriber
