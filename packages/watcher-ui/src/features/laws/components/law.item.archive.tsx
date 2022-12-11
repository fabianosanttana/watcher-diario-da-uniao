import { Heading, Link } from '@primer/react'
import React from 'react'
import { LawResponse } from '../interfaces/law-response.interface'

interface LawItemArchiveProps {
  archive: LawResponse['archives'][0]
}

const LawItemArchive: React.FC<LawItemArchiveProps> = ({ archive }) => {
  return (
    <div>
      <Link href={archive.url} target={'_blank'} rel="noreferrer">
        <Heading sx={{ fontSize: 1, mb: 2 }}>{archive.title}</Heading>
      </Link>
      <Heading sx={{ fontSize: 1, mb: 2 }}>{archive.smallContent}</Heading>
      <Heading sx={{ fontSize: 1, mb: 2, opacity: '.6' }}>
        Data publicação: {archive.publishedAt}
      </Heading>
    </div>
  )
}

export default LawItemArchive
