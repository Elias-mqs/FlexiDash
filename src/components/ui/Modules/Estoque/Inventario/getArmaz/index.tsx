import { Suspense, useEffect, useState } from 'react'

import { Select } from '@chakra-ui/react'

interface CodArmazProps {
  cod: string
}

interface ArmazProps {
  armaz: CodArmazProps[]
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function Armazens({ field }: any) {
  const [armaz, setArmaz] = useState<CodArmazProps[]>([])

  useEffect(() => {
    async function getArmaz() {
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

        setArmaz(data.armaz)
      } catch (error) {
        throw new Error('Failed to fetch data')
      }
    }

    getArmaz()
  }, [])

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
