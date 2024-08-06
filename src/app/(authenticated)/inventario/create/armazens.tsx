
import { Select } from "@chakra-ui/react"
import { Suspense, useEffect, useState } from "react";
import { env } from "@/env";

interface Armaz {
    arma: string;
}

interface ArmazProps {
    prate: Armaz[];
}

export function Armazens({ field }: any) {

    const [armaz, setArmaz] = useState<Armaz[]>([]);

    useEffect(() => {
        async function getArmaz() {
            const res = await fetch(`${env.ENDPOINT_ESTOQUE}CARMA=01`, { method: 'GET' })
            const data: ArmazProps = await res.json()
            setArmaz(data.prate)
        }

        getArmaz();
    }, [])

    console.log("renderizando no arquivo armazem")


    return (
        <Suspense>
            <Select {...field} placeholder='XX' color='#000' focusBorderColor='blue.300' required>
                {armaz.map((armaz) => (
                    <option key={armaz.arma} value={armaz.arma} style={{ fontWeight: 500, backgroundColor: '#f5f5f5' }}>
                        {armaz.arma}
                    </option>)
                )}
            </Select>
        </Suspense>
    )
}

//PRECISO FAZER ESSE COMPONENTE FUNCIONAR DE ALGUMA FORMA, ESTA FAZENDO A REQUISIÇÃO, O PROBLEMA ESTA NA HORA DE FAZER O MAP
// assistir esse video: https://www.youtube.com/watch?v=6JnkwfrAI-U&t=1089s