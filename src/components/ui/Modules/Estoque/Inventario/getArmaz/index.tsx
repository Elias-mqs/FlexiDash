import { Suspense } from 'react'

import { Select } from '@chakra-ui/react'
import { keepPreviousData, useQuery } from '@tanstack/react-query'

interface CodArmazProps {
  cod: string
}

interface ArmazProps {
  armaz: CodArmazProps[]
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function Armazens({ field }: any) {
  const { data: armaz } = useQuery({
    queryKey: ['get-armazens', 'page-status-inventory', 'input-select'],
    queryFn: async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT_ARMAZENS}`, {
          method: 'GET',
          cache: 'force-cache',
          next: { revalidate: 3600 },
        })

        if (!res.ok) {
          throw new Error('Failed to fetch data')
        }

        const data: ArmazProps = await res.json()

        return data.armaz as CodArmazProps[]
      } catch (error) {
        console.error('Error fetching data get-armazens', error)
      }
    },
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  })

  if (!armaz) {
    return (
      <Suspense>
        <Select
          {...field}
          placeholder="XX"
          color="gray.500"
          fontWeight={500}
          focusBorderColor="blue.300"
          _hover={{ cursor: 'pointer' }}
          required
        >
          <option style={{ fontWeight: 500, backgroundColor: '#f5f5f5' }}></option>
        </Select>
      </Suspense>
    )
  }

  return (
    <Suspense>
      <Select
        {...field}
        placeholder="XX"
        color="gray.500"
        fontWeight={500}
        focusBorderColor="blue.300"
        _hover={{ cursor: 'pointer' }}
        required
      >
        {armaz.map((armaz) => (
          <option key={armaz.cod} value={armaz.cod} style={{ fontWeight: 500, backgroundColor: '#f5f5f5' }}>
            {armaz.cod}
          </option>
        ))}
      </Select>
    </Suspense>
  )
}
