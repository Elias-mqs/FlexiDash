export async function fetchAccess(url: string) {
  try {
    const response = await fetch(url, {
      method: 'GET',
      cache: 'force-cache',
      next: { revalidate: 3600 },
    })
    return await response.json()
  } catch (error) {
    console.error(`Erro ao buscar dados no middleware: ${error}`)
    return null
  }
}
