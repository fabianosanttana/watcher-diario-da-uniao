export const dateToBr = (date: string) => {
  const locale = 'pt-br'

  return new Date(date).toLocaleDateString(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}
