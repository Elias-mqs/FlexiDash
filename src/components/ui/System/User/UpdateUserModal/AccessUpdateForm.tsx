import { useState } from 'react'

import { Checkbox, Flex, Spinner, Text } from '@chakra-ui/react'
import { useQuery } from '@tanstack/react-query'
import { Control, Controller, UseFormSetValue, UseFormWatch } from 'react-hook-form'

import { FeaturesListProps } from '@/app/api/system/user/list-system-features/route'
import { api } from '@/services'

import { UserDataFormProps } from './UserUpdateForm'

interface AccessUpdateFormProps {
  control: Control<UserDataFormProps>
  watch: UseFormWatch<UserDataFormProps>
  setValue: UseFormSetValue<UserDataFormProps>
}

export function AccessUpdateForm({ control, watch, setValue }: AccessUpdateFormProps) {
  const [activeIndex, setActiveIndex] = useState<number>(0) // Controla qual lista está ativa (Módulos, Rotinas, ou Recursos)

  /// Define ativo o item do aside "Acessos"
  const handleItemClick = (index: number) => {
    setActiveIndex(index)
  }

  return (
    <Flex direction="column" mt={6} mb={6} borderTop="1px solid #f0f0f0">
      <Text as="h2" p={2} fontSize={14} fontWeight="bold">
        Acessos
      </Text>
      <Flex as="section">
        <Flex as="aside" flex="1" direction="column" borderRight="1px solid #f0f0f0">
          <Flex as="ul" gap={2} mt={2} direction="column">
            {['Módulos', 'Rotinas', 'Recursos'].map(
              (
                item,
                index, // Só exibe o item se ele for visível
              ) => (
                <Flex
                  key={item}
                  as="li"
                  py={1}
                  pl={2}
                  pr={12}
                  bg={activeIndex === index ? 'gray.200' : 'transparent'}
                  borderLeft="3px solid #63b3ed"
                  _hover={{ cursor: 'pointer', bg: '#EDF2F7' }}
                  onClick={() => handleItemClick(index)} // Atualiza o activeIndex para a seleção
                >
                  <Text as="button" fontWeight={500}>
                    {item}
                  </Text>
                </Flex>
              ),
            )}
          </Flex>
        </Flex>

        <ArticleOptions activeIndex={activeIndex} control={control} watch={watch} setValue={setValue} />
      </Flex>
    </Flex>
  )
}

/// /////////////////////////////////////////////////////////////////////////////////////////////
/// ////////////////// Abaixo está a lógica pra o funcionamento dos CheckBoxes //////////////////
/// /////////////////////////////////////////////////////////////////////////////////////////////

interface ArticleOptionsProps extends AccessUpdateFormProps {
  activeIndex: number
}

interface SisRecursoRotina {
  id: number
  nome: string
  rotina_id: number
}

interface SisRotina {
  id: number
  nome: string
  mod_id: number
  sis_recurso_rotina: SisRecursoRotina[]
}

function ArticleOptions({ activeIndex, control, watch, setValue }: ArticleOptionsProps) {
  /// Busca as todas as features disponiveis no sistema (módulos, rotinas e recursos)
  const { data: listSystemFeatures } = useQuery<FeaturesListProps[]>({
    queryKey: ['user', 'get-aticle-options'],
    queryFn: async () => {
      const res = await api.get('system/user/list-system-features')
      return res.data.featuresList
    },
  })

  if (!listSystemFeatures) {
    return (
      <Flex as="article" pb={8} flex="4" direction="column" align="center" justify="center" gap={2}>
        <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
      </Flex>
    )
  }

  /// Variável para atualizar a propriedade do formulário ao clicar no CheckBox
  const userAccesses: FeaturesListProps[] = watch('userAccesses')

  /// /////////////// Controla os módulos que vão para o formulário ///////////////
  const handleModuleChange = (module: FeaturesListProps, checked: boolean) => {
    const updatedAccesses = checked
      ? [...userAccesses, { id: module.id, nome: module.nome, sis_rotinas: [] }]
      : userAccesses.filter((acsMod) => acsMod.id !== module.id)

    setValue('userAccesses', updatedAccesses)
  }

  /// /////////////// Controla as rotinas dentro dos módulos ///////////////
  const handleRoutineChange = (moduleId: number, routine: SisRotina, checked: boolean) => {
    // Localiza o módulo com o moduleId
    const updatedAccesses = userAccesses.map((module) => {
      if (module.id === moduleId) {
        // Adiciona ou remove a rotina do módulo encontrado
        const updatedRoutines = checked
          ? [
              ...module.sis_rotinas,
              { id: routine.id, nome: routine.nome, mod_id: routine.mod_id, sis_recurso_rotina: [] },
            ] // Adiciona a rotina se checked for true
          : module.sis_rotinas.filter((acsRot) => acsRot.id !== routine.id) // Remove se for false

        // Retorna o módulo com as rotinas atualizadas
        return { ...module, sis_rotinas: updatedRoutines }
      }
      return module // Retorna os outros módulos sem alterações
    })

    // Atualiza a lista de módulos no formulário
    setValue('userAccesses', updatedAccesses)
  }

  /// /////////////// Controla os recursos dentro das rotinas ///////////////
  const handleResourceChange = (moduleId: number, routineId: number, resource: SisRecursoRotina, checked: boolean) => {
    const updatedAccesses = userAccesses.map((module) => {
      if (module.id === moduleId) {
        const updatedRoutine = module.sis_rotinas.map((routine) => {
          if (routine.id === routineId) {
            const updatedResources = checked
              ? [...routine.sis_recurso_rotina, resource]
              : routine.sis_recurso_rotina.filter((acsResource) => acsResource.id !== resource.id)

            return { ...routine, sis_recurso_rotina: updatedResources }
          }

          return routine
        })

        return { ...module, sis_rotinas: updatedRoutine }
      }

      return module
    })

    setValue('userAccesses', updatedAccesses)
  }

  /// ///////////////////////// Abaixo são os componentes que serão renderizados ///////////////////////////

  /// Lista de módulos
  if (activeIndex === 0) {
    return (
      <Flex as="article" flex="4" m={4} mt={2} ml={8} gap={1} direction="column">
        <Text as="h3" fontSize={14} color="gray.500" fontWeight="semibold">
          Módulos
        </Text>
        {listSystemFeatures.map((module) => {
          // Variável para deixar marcado os módulos que já estão cadastrados no usuário
          const isChecked = userAccesses.some((acsMod) => acsMod.id === module.id)

          return (
            <Controller
              key={module.id}
              control={control}
              name="userAccesses"
              render={() => (
                <Checkbox
                  fontWeight={500}
                  isChecked={isChecked}
                  onChange={(e) => handleModuleChange(module, e.target.checked)}
                  value={module.id}
                >
                  {module.nome}
                </Checkbox>
              )}
            />
          )
        })}
      </Flex>
    )
  }

  /// Lista de rotinas
  if (activeIndex === 1) {
    return (
      <Flex as="article" flex="4" m={4} mt={2} ml={8} gap={2} direction="column">
        {listSystemFeatures.map((module) => (
          <Flex key={module.id} direction="column" gap={1}>
            <Text as="h3" fontSize={14} color="gray.500" fontWeight="semibold">
              {module.nome}
            </Text>

            {module.sis_rotinas.map((routine) => {
              // Variável para deixar marcado as rotinas que já estão cadastradas no usuário
              const isChecked = userAccesses.some((acsMod) =>
                acsMod.sis_rotinas.some((acsRot) => acsRot.id === routine.id),
              )

              return (
                <Checkbox
                  key={routine.id}
                  fontWeight={500}
                  isChecked={isChecked}
                  onChange={(e) => handleRoutineChange(module.id, routine, e.target.checked)}
                >
                  {routine.nome}
                </Checkbox>
              )
            })}
          </Flex>
        ))}
      </Flex>
    )
  }

  if (activeIndex === 2) {
    return (
      <Flex as="article" flex="4" m={4} mt={2} ml={8} gap={2} direction="column">
        {listSystemFeatures.map((module) => {
          const routine = module.sis_rotinas.find((routine) => routine.mod_id === module.id)

          return (
            <Flex key={module.id} direction="column" gap={1}>
              <Text as="h3" fontSize={14} color="gray.500" fontWeight="semibold">
                {module.nome} {'>'} {routine?.nome}
              </Text>
              {routine?.sis_recurso_rotina.map((resource) => {
                const isChecked = userAccesses.some((acsMod) =>
                  acsMod.sis_rotinas.some((acsRot) =>
                    acsRot.sis_recurso_rotina.some((acsRec) => acsRec.id === resource.id),
                  ),
                )

                return (
                  <Checkbox
                    key={resource.id}
                    fontWeight={500}
                    isChecked={isChecked}
                    onChange={(e) => handleResourceChange(module.id, routine.id, resource, e.target.checked)}
                  >
                    {resource.nome}
                  </Checkbox>
                )
              })}
            </Flex>
          )
        })}
      </Flex>
    )
  }
}
