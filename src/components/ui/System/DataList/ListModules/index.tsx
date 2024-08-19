import { Suspense, useEffect, useState } from 'react'

import { Select, useToast } from '@chakra-ui/react'

import { api, FormsCrypt } from '@/services'

interface ListModulesProps {
  id: number
  mod_id: number
  sis_modulos: {
    nome: string
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function ListModules({ field }: any) {
  const toast = useToast()

  const [listMod, setListMod] = useState<ListModulesProps[]>([])

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const res = await api.get('/system/listModules')
        const data: ListModulesProps[] = FormsCrypt.verifyData(res.data)
        setListMod(data)
      } catch (error) {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const coerceString = (data: ListModulesProps) => {
    const dataList = { ...data, module: data.sis_modulos.nome, acsModId: data.id }
    const {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      id,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      sis_modulos: { nome },
      ...dataMod
    } = dataList
    return JSON.stringify(dataMod)
  }

  return (
    <Suspense>
      <Select
        bg="#f0f0f0"
        placeholder="XX"
        color="#000"
        focusBorderColor="blue.300"
        border="2px solid #c0c0c0"
        required
        {...field}
      >
        {listMod.map((modules, index) => (
          <option value={coerceString(modules)} key={index} style={{ fontWeight: 500, backgroundColor: '#f5f5f5' }}>
            {modules.sis_modulos.nome}
          </option>
        ))}
      </Select>
    </Suspense>
  )
}
