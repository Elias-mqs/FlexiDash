export async function verifyStatusInventory(baseUrl: string) {
  try {
    const verify = await fetch(`${baseUrl}/api/modules/stock/inventory/verifyStatus`, {
      method: 'GET',
      cache: 'no-cache',
    })

    const { status } = await verify.json()

    return status as boolean
  } catch (error) {
    console.error('Erro ao verificar status do inventario no middleware', error)
  }
}
