import { PrismaClient } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

import { FormsCrypt } from '@/services'
import { dbInventory } from '@/utils/database/modules/estoque/inventario'

interface SisRecursoRotina {
  id: number
  nome: string
  slug: string
}

interface SisRotina {
  id: number
  nome: string
  slug: string
  sis_recurso_rotina: SisRecursoRotina[]
}

interface SisModulos {
  id: number
  nome: string
  slug: string
  sis_rotinas: SisRotina[]
}

interface SisAcessModulo {
  sis_modulos: SisModulos
}

export interface MenuAccessListProps {
  sis_acess_modulo: SisAcessModulo[]
}

export async function POST(request: NextRequest) {
  const prisma = new PrismaClient()

  const data = await request.json()
  const { userId } = FormsCrypt.verifyData(data)

  try {
    const menuAccessData: MenuAccessListProps | null = await prisma.sis_usuarios.findUnique({
      where: {
        id: userId,
      },
      select: {
        sis_acess_modulo: {
          select: {
            sis_modulos: {
              select: {
                id: true,
                nome: true,
                slug: true,
                sis_rotinas: {
                  select: {
                    id: true,
                    nome: true,
                    slug: true,
                    sis_recurso_rotina: {
                      select: {
                        id: true,
                        nome: true,
                        slug: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    })

    if (!menuAccessData) throw new Error('Erro ao buscar lista de acessos')

    /// //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /// //////// Nesse bloco irão ficar os tratamentos dos drop menus que precisarem de condições para renderizar ////////
    /// //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    const hasShelfAccess = menuAccessData.sis_acess_modulo.some((listMod) =>
      listMod.sis_modulos.sis_rotinas.some((listRout) =>
        listRout.sis_recurso_rotina.some((listRes) => listRes.id === 3),
      ),
    )

    if (hasShelfAccess) {
      const hasStartedInventory = await dbInventory.invDocument.verifyStatus()

      if (!hasStartedInventory) {
        // Mapeando os módulos para filtrar as rotinas que têm o recurso com id 3 removido
        const newMenuAccessData: MenuAccessListProps = {
          sis_acess_modulo: menuAccessData.sis_acess_modulo.map((listMod) => ({
            ...listMod,
            sis_modulos: {
              ...listMod.sis_modulos,
              sis_rotinas: listMod.sis_modulos.sis_rotinas.map((listRout) => ({
                ...listRout,
                sis_recurso_rotina: listRout.sis_recurso_rotina.filter(
                  (listRes) => listRes.id !== 3, // Remove o recurso com id 3
                ),
              })),
            },
          })),
        }

        return NextResponse.json(newMenuAccessData, { status: 200 })
      }
    }

    return NextResponse.json(menuAccessData, { status: 200 })
  } catch (error) {
    console.error('Erro ao buscar dados para menu do sidebar (menu-access):', error)
    return NextResponse.json({ message: 'Erro interno, contate a TI' }, { status: 500 })
  }
}
