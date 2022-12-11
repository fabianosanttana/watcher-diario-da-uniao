import { LawLayout } from './features/laws'
import { PageLayout } from '@primer/react'
import PageHeader from './components/header'

const App = () => {
  return (
    <PageLayout padding={'none'} containerWidth="full">
      <PageHeader />
      <PageLayout.Content padding={'normal'}>
        <LawLayout />
      </PageLayout.Content>
    </PageLayout>
  )
}

export default App
