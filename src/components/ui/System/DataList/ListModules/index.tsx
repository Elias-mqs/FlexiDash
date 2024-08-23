import { Select, useToast } from '@chakra-ui/react'
import { useQuery } from '@tanstack/react-query'

import { api, FormsCrypt } from '@/services'

interface ListModulesProps {
  id: number
  mod_id: number
  sis_modulos?: {
    nome?: string
    slug?: string
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function ListModules({ field }: any) {
  const toast = useToast()

  const fetchModules = async () => {
    try {
      const res = await api.get('/system/listModules')

      const data = FormsCrypt.verifyData(res.data)

      return data as ListModulesProps[]
    } catch (error) {
      toast({
        title: 'Erro interno',
        description: 'Contate a TI',
        status: 'error',
        position: 'top',
        duration: 3000,
        isClosable: true,
      })
      return []
    }
  }

  const { data: listMod } = useQuery({
    queryKey: ['acsModData'],
    queryFn: fetchModules,
    enabled: true,
    refetchOnWindowFocus: false,
    staleTime: 5000,
  })

  if (!listMod) return

  const coerceString = (data: ListModulesProps) => {
    const dataList = { ...data, moduleName: data.sis_modulos?.nome, acsModId: data.id, slug: data.sis_modulos?.slug }
    const {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      id,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars, camelcase
      sis_modulos,
      ...dataMod
    } = dataList!
    return JSON.stringify(dataMod)
  }

  return (
    <Select
      bg="#f0f0f0"
      placeholder="XX"
      color="#000"
      focusBorderColor="blue.300"
      border="2px solid #c0c0c0"
      required
      {...field}
    >
      {listMod?.map((modules, index) => (
        <option value={coerceString(modules)} key={index} style={{ fontWeight: 500, backgroundColor: '#f5f5f5' }}>
          {modules?.sis_modulos?.nome}
        </option>
      ))}
    </Select>
  )
}
