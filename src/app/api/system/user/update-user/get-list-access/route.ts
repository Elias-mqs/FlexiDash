import { NextResponse, type NextRequest } from 'next/server'

import { FormsCrypt } from '@/services'
import { db } from '@/utils/database'

export async function POST(request: NextRequest) {
  const data = await request.json()
  const dataUser = FormsCrypt.verifyData(data)

  try {
    console.log(dataUser)

    const extractedAccessList = await extractAccessLists(dataUser.id)

    console.log('AccessList: ', extractedAccessList)

    return NextResponse.json(extractedAccessList, { status: 200 })
  } catch (error) {
    console.error('Erro no get-list-access:', error)
    return NextResponse.json({ message: 'Erro interno, contate a TI' }, { status: 500 })
  }
}

/// ///////////////// Buscando e extraindo dados //////////////////////
async function extractAccessLists(userId: number) {
  try {
    // Chama a função que busca os acessos do usuário
    const userAccess = await db.updateUser.getUserAccess(userId)

    // Inicializa as listas para armazenar os módulos, rotinas e recursos
    const modulesList: { id: number; name: string }[] = []
    const routinesList: { id: number; name: string }[] = []
    const resourcesList: { id: number; name: string }[] = []

    // Verifica se há acessos de módulos
    if (userAccess && userAccess.sis_acess_modulo) {
      userAccess.sis_acess_modulo.forEach((modulo) => {
        // Adiciona o módulo na lista de módulos
        modulesList.push({
          id: modulo.sis_modulos.id,
          name: modulo.sis_modulos.nome,
        })

        // Verifica e percorre as rotinas dentro do módulo
        if (modulo.sis_modulos.sis_rotinas) {
          modulo.sis_modulos.sis_rotinas.forEach((rotina) => {
            // Adiciona a rotina na lista de rotinas
            routinesList.push({
              id: rotina.id,
              name: rotina.nome,
            })

            // Verifica e percorre os recursos dentro da rotina
            if (rotina.sis_recurso_rotina) {
              rotina.sis_recurso_rotina.forEach((recurso) => {
                // Adiciona o recurso na lista de recursos
                resourcesList.push({
                  id: recurso.id,
                  name: recurso.nome,
                })
              })
            }
          })
        }
      })
    }

    // Retorna as três listas separadas
    return {
      modules: modulesList,
      routines: routinesList,
      resources: resourcesList,
    }
  } catch (error) {
    console.error('Error extracting access lists:', error)
    throw error
  }
}
