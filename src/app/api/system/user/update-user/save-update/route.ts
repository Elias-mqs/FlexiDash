import { NextRequest, NextResponse } from 'next/server'

import { UserDataFormProps } from '@/components/ui/System/User/UpdateUserModal/UserUpdateForm'
import { FormsCrypt } from '@/services'
import { db } from '@/utils/database'

import { UserAccessProps } from '../get-list-access/types'

interface UserDataUpdateProps extends UserDataFormProps {
  userId: number
}

export async function POST(request: NextRequest) {
  const data = await request.json()
  const dataUser: UserDataUpdateProps = FormsCrypt.verifyData(data)

  try {
    /// Busca os dados antigos do usuário
    const oldDbUserData = await db.users.findUserById(dataUser.userId)

    if (!oldDbUserData) {
      return NextResponse.json(
        { message: 'Usuário inválido, tente acessar novamente ou contate a TI' },
        { status: 400 },
      )
    }

    /// Converte status para boolean
    const userStatus = dataUser.active === 'active'

    /// Prepara as informações do usuário que serão atualizadas
    const prepareDataUpdate = {
      userId: oldDbUserData.id,
      newName: oldDbUserData.nome !== dataUser.name ? dataUser.name : undefined,
      newEmail: oldDbUserData.email !== dataUser.email ? dataUser.email : undefined,
      newUsername: oldDbUserData.usuario !== dataUser.username ? dataUser.username : undefined,
      newStatus: userStatus,
    }

    /// Atualiza as informações do usuário
    await db.users.updateUser(prepareDataUpdate)

    /// Busca os acessos que o usuário já tem cadastrados
    const oldUserAccesses: UserAccessProps | null = await db.users.getUserAccess(dataUser.userId) /// essa linha é só teste

    /// Preparando acessos para deletar
    const deleteAccesses = oldUserAccesses ? prepareDeleteAccesses(oldUserAccesses, dataUser) : []

    /// Prepara um objeto com arrays caso o usuário não tenha nenhum acesso cadastrado
    const deleteEmptyAccesses = {
      acsModIds: [],
      acsRoutIds: [],
      acsResIds: [],
    }

    /// Prepara acessos que serão criados
    const createAccesses = prepareCreateAccesses(oldUserAccesses, dataUser)

    /// Atualiza todos os acessos do usuário
    await db.users.updateUserAccesses({
      userId: dataUser.userId,
      deleteAccesses: Array.isArray(deleteAccesses) ? deleteEmptyAccesses : deleteAccesses.prepareDelete,
      createAccesses,
    })

    return NextResponse.json({ message: 'Dados do usuário atualizados' }, { status: 200 })
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error)
    return NextResponse.json({ message: 'Erro interno, contate a TI' }, { status: 500 })
  }
}

/// /////////////////////////////////////////////////////////////////////////////////////////////////
/// //////////////////// Prepara o objeto de acessos a serem deletados //////////////////////////////
/// /////////////////////////////////////////////////////////////////////////////////////////////////
function prepareDeleteAccesses(oldUserAccesses: UserAccessProps, dataUser: UserDataUpdateProps) {
  const acsModToDelete = !oldUserAccesses
    ? []
    : oldUserAccesses.sis_acess_modulo.filter(
        (oldAcsMod) => !dataUser.userAccesses.some((acsMod) => acsMod.id === oldAcsMod.mod_id),
      )

  const acsRoutToDelete = !oldUserAccesses
    ? []
    : oldUserAccesses.sis_acess_modulo.flatMap((oldAcsMod) =>
        oldAcsMod.sis_acess_rotina.filter(
          (oldAcsRout) =>
            !dataUser.userAccesses.some(
              (acsMod) =>
                acsMod.id === oldAcsMod.mod_id &&
                acsMod.sis_rotinas.some((acsRout) => acsRout.id === oldAcsRout.rotina_id),
            ),
        ),
      )

  const acsResToDelete = !oldUserAccesses
    ? []
    : oldUserAccesses.sis_acess_modulo.flatMap((oldAcsMod) =>
        oldAcsMod.sis_acess_rotina.flatMap((oldAcsRout) =>
          oldAcsRout.sis_acess_recurso.filter(
            (oldAcsRes) =>
              !dataUser.userAccesses.some(
                (acsMod) =>
                  acsMod.id === oldAcsMod.mod_id &&
                  acsMod.sis_rotinas.some(
                    (acsRout) =>
                      acsRout.id === oldAcsRout.rotina_id &&
                      acsRout.sis_recurso_rotina.some((acsRes) => acsRes.id === oldAcsRes.rec_rotina_id),
                  ),
              ),
          ),
        ),
      )

  const prepareDelete = {
    acsModIds: acsModToDelete.map((acsMod) => acsMod.id),
    acsRoutIds: acsRoutToDelete.map((acsRout) => acsRout.id),
    acsResIds: acsResToDelete.map((acsRes) => acsRes.id),
  }

  return { prepareDelete }
}

/// /////////////////////////////////////////////////////////////////////////////////////////////////
/// ////////////////////// Prepara o objeto de acessos a serem criados //////////////////////////////
/// /////////////////////////////////////////////////////////////////////////////////////////////////
function prepareCreateAccesses(oldUserAccesses: UserAccessProps | null, dataUser: UserDataUpdateProps) {
  const acsModToCreate = !oldUserAccesses
    ? dataUser.userAccesses.map(({ id, nome }) => ({ id, nome }))
    : dataUser.userAccesses
        .filter((module) => !oldUserAccesses.sis_acess_modulo.some((oldAcsMod) => oldAcsMod.mod_id === module.id))
        .map(({ id, nome }) => ({ id, nome }))

  const acsRoutToCreate = !oldUserAccesses
    ? dataUser.userAccesses.flatMap((module) =>
        module.sis_rotinas.map(({ id, nome, mod_id: modId }) => ({ id, nome, modId })),
      )
    : dataUser.userAccesses
        .flatMap((module) =>
          module.sis_rotinas.filter(
            (routine) =>
              !oldUserAccesses.sis_acess_modulo.some((oldAcsMod) =>
                oldAcsMod.sis_acess_rotina.some((oldAcsRout) => oldAcsRout.rotina_id === routine.id),
              ),
          ),
        )
        .map(({ id, nome, mod_id: modId }) => ({ id, nome, modId }))

  const acsResToCreate = !oldUserAccesses
    ? dataUser.userAccesses.flatMap((module) =>
        module.sis_rotinas.flatMap((routine) => routine.sis_recurso_rotina.map((resource) => resource)),
      )
    : dataUser.userAccesses.flatMap((module) =>
        module.sis_rotinas.flatMap((routine) =>
          routine.sis_recurso_rotina.filter(
            (resource) =>
              !oldUserAccesses.sis_acess_modulo.some((oldAcsMod) =>
                oldAcsMod.sis_acess_rotina.some((oldAcsRout) =>
                  oldAcsRout.sis_acess_recurso.some((oldAcsRes) => oldAcsRes.rec_rotina_id === resource.id),
                ),
              ),
          ),
        ),
      )

  const prepareDataToCreate = {
    modules: acsModToCreate,
    routines: acsRoutToCreate,
    resources: acsResToCreate,
  }

  return prepareDataToCreate
}
