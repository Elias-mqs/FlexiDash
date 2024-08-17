import { Suspense, useEffect, useState } from 'react'

import { Select, useToast } from '@chakra-ui/react'

import { api, FormsCrypt } from '@/services'

interface ListModulesProps {
  mod_id: number
  sis_modulos: {
    nome: string
  }
}

export function ListModules() {
  const toast = useToast()

  const [listMod, setListMod] = useState<ListModulesProps[]>([])

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const res = await api.get('/system/listModules')
        console.log(res)
        const data: ListModulesProps[] = FormsCrypt.verifyData(res.data)
        console.log(data)
        setListMod(data)
      } catch (error) {
        console.log(error)
        return toast({
          title: 'Erro interno',
          description: 'Contate a TI',
          status: 'error',
          position: 'top',
          duration: 3000,
          isClosable: true,
        })
      }
    }
    fetchModules()
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
        {listMod.map((modules, index) => (
          <option value={modules.mod_id} key={index} style={{ fontWeight: 500, backgroundColor: '#f5f5f5' }}>
            {modules.sis_modulos.nome}
          </option>
        ))}
      </Select>
    </Suspense>
  )
}
