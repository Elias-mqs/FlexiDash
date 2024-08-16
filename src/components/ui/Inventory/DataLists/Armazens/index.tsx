import { Suspense, useEffect, useState } from 'react'

import { Select } from '@chakra-ui/react'

// USAR ESSE DEPOIS DE COMPILAR(VAI SER COMPLADO HJ A NOITE 07/08) A ULTIMA ALTERTAÇÃO DA API
// interface CodArmazProps {
//     cod: string
// }

// interface ArmazProps {
//     armaz: CodArmazProps[]
// }

interface CodArmazProps {
  codigo: string
}

interface ArmazProps {
  armazens: CodArmazProps[]
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

        console.log(data)

        setArmaz(data.armazens)
      } catch (error) {
        throw new Error('Failed to fetch data')
      }
    }

    getArmaz()
  }, [])

  console.log('renderizando no arquivo armazem')

  return (
    <Suspense>
      <Select {...field} placeholder="XX" color="#000" focusBorderColor="blue.300" required>
        {armaz.map((armaz) => (
          <option key={armaz.codigo} value={armaz.codigo} style={{ fontWeight: 500, backgroundColor: '#f5f5f5' }}>
            {armaz.codigo}
          </option>
        ))}
      </Select>
    </Suspense>
  )
}
