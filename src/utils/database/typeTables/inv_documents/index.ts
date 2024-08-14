import { Generated, Insertable, Selectable, Updateable } from "kysely"


export interface InventarioTable {
    doc_id: Generated<number>               //ID DO DOCUMENTO
    doc_codInv: string                      //CODIGO DO INVENTARIO É O NUMERO DO DOCUMENTO NO TOTVS
    doc_status: 'aberto' | 'encerrado'
    doc_armaz: string
    doc_usrIni: number                      //ID DO USER QUE ABRIU
    doc_inicio: string                      //DATA DE INICIO DO INVENTARIO
    doc_usrEnc: number | null               //ID DO USER QUE FECHOU
    doc_fim: string | null                  //DATA DO ENCERRAMENTO DO INVENTARIO
}

export type Inventory = Selectable<InventarioTable>
export type NewInventory = Insertable<InventarioTable>
export type InventoryUpdate = Updateable<InventarioTable>