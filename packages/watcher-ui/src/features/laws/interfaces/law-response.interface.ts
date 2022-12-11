export interface LawResponse {
  id: string
  title: string
  params: LawResponseParams
  createdAt: string
  updatedAt: string
  lastScrape: {
    date: string
    totalResults: number
  }
  url: string
  hasUpdatedWithinLastTwoDays: boolean
  archives: LawResponseArchive[]
  observers: string[]
}

interface LawResponseArchive {
  title: string
  smallContent: string
  url: string
  publishedAt: string
}

export interface LawResponseParams {
  query: string
  mainOrganization: string
  subOrganization: string
  actType: string
}
