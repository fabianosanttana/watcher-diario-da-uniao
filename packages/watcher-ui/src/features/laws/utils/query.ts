export const extractParamsFromQuery = (query: string) => {
  const searchParams = query.split('?')[1]
  if (!searchParams) return null

  const params = new URLSearchParams(searchParams)

  return {
    query: params.get('q') || '',
    mainOrganization: params.get('orgPrin') || '',
    subOrganization: params.get('orgSub') || '',
    actType: params.get('artType') || ''
  }
}
