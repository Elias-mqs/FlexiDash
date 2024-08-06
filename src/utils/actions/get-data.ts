
export interface ParamsProps {
    descPra: string | null,
    armaz: string | null,
    document: string | null
}

export async function getItems(params: ParamsProps) {

    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT_ESTOQUE}CPART=${params.descPra}
            &CARMAZ=${params.armaz}&CDOC=${params.document}`, { method: 'GET' });

        if(!res.ok){
            throw new Error("Failed to fetch data");
        }

        return res.json();

    }catch(error){
        throw new Error("Failed to fetch data");
    }
}
