import { Suspense, useEffect } from 'react'

import { Select } from '@chakra-ui/react'

import { api } from '@/services'

export function ListModules() {
  const dataUser = 'testes'

  useEffect(() => {
    const res = api.post('/system/listModules', dataUser)
    console.log(res)
  }, [])

  return (
    <Suspense>
      <Select
        bg="#f0f0f0"
        placeholder="XX"
        color="#000"
        focusBorderColor="blue.300"
        border="2px solid #c0c0c0"
        required
      >
        <option style={{ fontWeight: 500, backgroundColor: '#f5f5f5' }}>Modulo 1</option>
        <option style={{ fontWeight: 500, backgroundColor: '#f5f5f5' }}>Modulo 2</option>
        <option style={{ fontWeight: 500, backgroundColor: '#f5f5f5' }}>Modulo 3</option>
        <option style={{ fontWeight: 500, backgroundColor: '#f5f5f5' }}>Modulo 4</option>
        <option style={{ fontWeight: 500, backgroundColor: '#f5f5f5' }}>Modulo 5</option>
      </Select>
    </Suspense>
  )
}
