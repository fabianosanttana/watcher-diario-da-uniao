import { Avatar, Header, StyledOcticon, PageLayout } from '@primer/react'
import { EyeIcon } from '@primer/octicons-react'

const PageHeader = () => {
  return (
    <PageLayout.Header sx={{ marginBottom: 0 }}>
      <Header>
        <Header.Item>
          <Header.Link href="#" sx={{ fontSize: 18 }}>
            <StyledOcticon icon={EyeIcon} size={26} sx={{ mr: 2 }} />
            <span>Diário da União - Observador</span>
          </Header.Link>
        </Header.Item>
        <Header.Item full></Header.Item>
        <Header.Item>
          <Avatar
            src="/icon.png"
            size={30}
            square
            alt="Diário da união ícone"
          />
        </Header.Item>
      </Header>
    </PageLayout.Header>
  )
}

export default PageHeader
