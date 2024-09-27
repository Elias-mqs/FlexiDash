'use client'

import { useState } from 'react'

import { Button, Checkbox, Flex, Grid, Input, Spinner, Text, useToast } from '@chakra-ui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'

import { api, FormsCrypt } from '@/services'

interface PermissionListProps {
  id: number
  nome: string
  modId?: number
  rotinaId?: number
}

const userRegisterSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  username: z.string().min(5),
})

type UserRegisterProps = z.infer<typeof userRegisterSchema>

export default function UserRegister() {
  const toast = useToast()

  const [activeIndex, setActiveIndex] = useState<number>(0) // Controla qual lista está ativa (Módulos, Rotinas, ou Recursos)
  const [selectedModules, setSelectedModules] = useState<number[]>([]) // Módulos selecionados
  const [selectedRoutines, setSelectedRoutines] = useState<number[]>([]) // Rotinas selecionadas

  const [selectedResources, setSelectedResources] = useState<number[]>([]) // Estado para recursos selecionados
  const [resourceListForm, setResourceListForm] = useState<PermissionListProps[]>([]) // Prepara a lista de recursos para envio do form

  /// Query para listar módulos
  const { data: listModules } = useQuery({
    queryKey: ['list-modules-user'],
    queryFn: async () => {
      const res = await api.get('system/user/list-modules-user')
      return res.data.listModules as PermissionListProps[]
    },
    refetchOnWindowFocus: false,
  })

  /// Query para listar rotinas com base nos módulos selecionados
  const { data: listRoutines } = useQuery({
    queryKey: ['list-routines', selectedModules],
    queryFn: async () => {
      if (selectedModules.length === 0) return []
      const res = await api.post('system/user/list-routines-user', { modules: selectedModules })
      return res.data.listRoutines as PermissionListProps[]
    },
    enabled: selectedModules.length > 0,
    refetchOnWindowFocus: false,
  })

  /// Query para listar recursos com base nas rotinas selecionadas
  const { data: listResources } = useQuery({
    queryKey: ['list-resources', selectedRoutines],
    queryFn: async () => {
      if (selectedRoutines.length === 0) return []
      const res = await api.post('system/user/list-resources-user', { routines: selectedRoutines })
      return res.data.listResources as PermissionListProps[]
    },
    enabled: selectedRoutines.length > 0,
    refetchOnWindowFocus: false,
  })

  const { handleSubmit, control } = useForm({
    resolver: zodResolver(userRegisterSchema),
    defaultValues: { name: '', email: '', username: '' },
  })

  // Envia o registro
  const handleRegister = async (data: UserRegisterProps) => {
    if (!data.name || !data.email || !data.username) {
      return toast({
        title: 'Atenção',
        description: 'Informe os campos corretamente',
        status: 'error',
        position: 'top',
        duration: 3000,
        isClosable: true,
      })
    }

    if (selectedModules.length < 1) {
      return toast({
        title: 'Atenção',
        description: 'Selecione ao menos um módulo',
        status: 'info',
        position: 'top',
        duration: 3000,
        isClosable: true,
      })
    }

    if (selectedRoutines.length < 1) {
      return toast({
        title: 'Atenção',
        description: 'Selecione ao menos uma rotina',
        status: 'info',
        position: 'top',
        duration: 3000,
        isClosable: true,
      })
    }

    if (selectedResources.length < 1) {
      return toast({
        title: 'Atenção',
        description: 'Selecione ao menos um recurso',
        status: 'info',
        position: 'top',
        duration: 3000,
        isClosable: true,
      })
    }

    // Criptografa os dados antes do envio
    const formResgister = FormsCrypt.dataCrypt({
      ...data,
      listModules: selectedModules,
      listRoutines: selectedRoutines,
      // listResources: selectedResources,
      listResources: resourceListForm,
    })

    try {
      const res = await api.post('system/user/register/register-user', formResgister)

      toast({
        title: 'Sucesso!',
        description: res.data.message,
        status: 'success',
        position: 'top',
        duration: 2000,
        isClosable: true,
      })

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return toast({
        title: error.data?.title,
        description: error.data?.message,
        status: 'error',
        position: 'top',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  /// Define ativo o item do aside "Acessos"
  const handleItemClick = (index: number) => {
    setActiveIndex(index)
  }

  /// Lida com a seleção dos módulos
  const handleModuleChange = (isChecked: boolean, moduleId: number) => {
    if (isChecked) {
      setSelectedModules((prev) => [...prev, moduleId])
    } else {
      const updatedModules = selectedModules.filter((id) => id !== moduleId)
      setSelectedModules(updatedModules)

      // Desmarcar rotinas associadas ao módulo desmarcado
      const updatedRoutines = selectedRoutines.filter(
        (routineId) => !listRoutines?.some((routine) => routine.modId === moduleId && routine.id === routineId),
      )
      setSelectedRoutines(updatedRoutines)

      // Desmarcar recursos apenas das rotinas removidas
      const updatedResources = selectedResources.filter(
        (resourceId) =>
          !listResources?.some(
            (resource) =>
              listRoutines?.some((routine) => routine.modId === moduleId && resource.rotinaId === routine.id) &&
              resource.id === resourceId,
          ),
      )
      setSelectedResources(updatedResources)
    }
  }

  /// Lida com a seleção das rotinas
  const handleRoutineChange = (isChecked: boolean, routineId: number) => {
    if (isChecked) {
      setSelectedRoutines((prev) => [...prev, routineId])
    } else {
      const updatedRoutines = selectedRoutines.filter((id) => id !== routineId)
      setSelectedRoutines(updatedRoutines)

      // Desmarcar recursos associados apenas à rotina desmarcada
      const updatedResources = selectedResources.filter(
        (resourceId) =>
          !listResources?.some((resource) => resource.rotinaId === routineId && resource.id === resourceId),
      )
      setSelectedResources(updatedResources)
    }
  }

  /// Lida com a seleção dos recursos
  const handleResourceChange = (isChecked: boolean, resource: PermissionListProps) => {
    if (isChecked) {
      setSelectedResources((prev) => [...prev, resource.id])
      setResourceListForm((prev) => [...prev, resource])
    } else {
      setSelectedResources((prev) => prev.filter((id) => id !== resource.id))
      setResourceListForm((prev) => prev.filter((id) => id.id !== resource.id))
    }
  }

  /// Array condicional que muda de acordo com o activeIndex
  const permissionItems = [
    { title: 'Módulos', visible: true }, // Sempre visível
    { title: 'Rotinas', visible: selectedModules.length > 0 }, // Somente visível se houver módulos selecionados
    { title: 'Recursos', visible: selectedRoutines.length > 0 }, // Somente visível se houver rotinas selecionadas
  ]

  const columnsGrid = { base: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }

  return (
    <Flex w="100%" px={2} pb={2} direction="column" align="center" gap={8} overflow="auto">
      <Grid
        as="form"
        w="100%"
        maxW="container.xl"
        onSubmit={handleSubmit(handleRegister)}
        templateColumns={columnsGrid}
        gap={4}
        mt={4}
      >
        <Controller
          name="name"
          control={control}
          render={({ field: { onChange, value } }) => (
            <Flex direction="column">
              <Text fontSize={14} fontWeight={500} pb={0.5} pl={2}>
                Nome:
              </Text>
              <Input value={value} onChange={onChange} placeholder="nome" />
            </Flex>
          )}
        />

        <Controller
          name="email"
          control={control}
          render={({ field: { onChange, value } }) => (
            <Flex direction="column">
              <Text fontSize={14} fontWeight={500} pb={0.5} pl={2}>
                Email:
              </Text>
              <Input type="email" value={value} onChange={onChange} placeholder="email" />
            </Flex>
          )}
        />

        <Controller
          name="username"
          control={control}
          render={({ field: { onChange, value } }) => (
            <Flex direction="column">
              <Text fontSize={14} fontWeight={500} pb={0.5} pl={2}>
                Usuário:
              </Text>
              <Input
                value={value}
                onChange={(e) => onChange(e.target.value.trim().toLowerCase())}
                placeholder="usuario"
              />
            </Flex>
          )}
        />

        <Button type="submit" colorScheme="blue" mt="auto">
          Cadastrar
        </Button>
      </Grid>

      <Flex w="100%" maxW="container.xl" flex="1">
        <Flex as="aside" flex="1" direction="column" borderRight="1px solid #f0f0f0">
          <Text as="h2" p={2} fontSize={14} fontWeight="bold">
            Acessos
          </Text>
          <Flex as="ul" gap={2} mt={2} direction="column">
            {permissionItems.map(
              (item, index) =>
                item.visible && ( // Só exibe o item se ele for visível
                  <Flex
                    key={item.title}
                    as="li"
                    py={1}
                    pl={2}
                    pr={2}
                    bg={activeIndex === index ? 'gray.200' : 'transparent'}
                    borderLeft="3px solid #63b3ed"
                    _hover={{ cursor: 'pointer', bg: '#EDF2F7' }}
                    onClick={() => handleItemClick(index)} // Atualiza o activeIndex para a seleção
                  >
                    <Text fontWeight={500}>{item.title}</Text>
                  </Flex>
                ),
            )}
          </Flex>
        </Flex>

        {/* 
          Renderiza a lista de módulos apenas quando `activeIndex` é 0.
          A lógica a seguir realiza os seguintes passos:

          1. Verifica se `activeIndex` é igual a 0. Se a condição for verdadeira, um container (`Flex`) é renderizado.
          2. Dentro do container, verifica se `listModules` existe e se contém elementos (`listModules.length > 0`).
          3. Se houver módulos disponíveis, um título "Módulos" é exibido em um `Text` com formatação específica (tamanho da fonte e peso).
          4. Para cada módulo em `listModules`, um checkbox é renderizado. Cada checkbox:
            - Tem uma `key` única com base no `module.id`, garantindo que a lista seja gerenciável e que não ocorra um aviso de chave duplicada.
            - O estado `isChecked` é baseado na inclusão do `module.id` em `selectedModules`, permitindo a persistência da seleção.
            - O manipulador de evento `onChange` chama a função `handleModuleChange`, que atualiza a seleção do módulo quando o checkbox é alterado.
          5. Se `listModules` estiver vazio, um spinner é exibido para indicar que os dados estão sendo carregados.

          Essa estrutura permite que os usuários selecionem módulos de forma dinâmica, refletindo suas escolhas na interface.
        */}
        {activeIndex === 0 && (
          <Flex as="article" flex="4" m={4} mt={2} ml={8} gap={2} direction="column">
            {listModules && listModules.length > 0 ? (
              <>
                <Text as="h2" fontSize={14} fontWeight="bold">
                  Módulos
                </Text>
                {listModules.map((module) => (
                  <Checkbox
                    key={module.id}
                    fontWeight={500}
                    isChecked={selectedModules.includes(module.id)} // Persistência da seleção
                    onChange={(e) => handleModuleChange(e.target.checked, module.id)}
                  >
                    {module.nome}
                  </Checkbox>
                ))}
              </>
            ) : (
              <Flex align="center" p={8} justify="center">
                <Spinner thickness="4px" speed="0.65s" color="blue.500" size="xl" />
              </Flex>
            )}
          </Flex>
        )}

        {/* 
          Renderiza as rotinas apenas quando `activeIndex` é 1 e há módulos selecionados.
          A lógica a seguir realiza os seguintes passos:

          1. Verifica se `activeIndex` é igual a 1 e se existem módulos selecionados (`selectedModules.length > 0`).
          2. Se a condição for verdadeira, renderiza um container (`Flex`) que exibirá as rotinas associadas aos módulos selecionados.
          3. Se `listRoutines` não estiver vazio, filtra `listModules` para incluir apenas os módulos que estão na lista de módulos selecionados.
          4. Para cada módulo, renderiza seu nome em um `Text` e, para cada módulo, renderiza checkboxes para as rotinas relacionadas a esse módulo.
          5. Os checkboxes mantêm a persistência da seleção de rotinas através de `isChecked`, utilizando a lista `selectedRoutines`.
          6. Se `listRoutines` estiver vazio, um spinner é exibido para indicar que os dados estão sendo carregados.

          Cada checkbox possui um manipulador de evento (`onChange`) que chama a função `handleRoutineChange` para atualizar a seleção das rotinas.
        */}
        {activeIndex === 1 && selectedModules.length > 0 && (
          <Flex as="article" flex="4" m={4} mt={2} ml={8} gap={2} direction="column">
            {listRoutines && listRoutines.length > 0 ? (
              <>
                {listModules &&
                  listModules
                    .filter(
                      (module) => module.id === selectedModules.find((selectedModule) => selectedModule === module.id),
                    )
                    .map((modules) => (
                      <Flex key={modules.id} direction="column" gap={2}>
                        <Text as="h2" fontSize={14} fontWeight="bold">
                          {modules.nome}
                        </Text>
                        {listRoutines
                          .filter((routine) => routine.modId === modules.id)
                          .map((routine) => (
                            <Checkbox
                              key={routine.id}
                              fontWeight={500}
                              isChecked={selectedRoutines.includes(routine.id)} // Persistência da seleção
                              onChange={(e) => handleRoutineChange(e.target.checked, routine.id)}
                            >
                              {routine.nome}
                            </Checkbox>
                          ))}
                      </Flex>
                    ))}
              </>
            ) : (
              <Flex align="center" p={8} justify="center">
                <Spinner thickness="4px" speed="0.65s" color="blue.500" size="xl" />
              </Flex>
            )}
          </Flex>
        )}

        {/* 
          Renderiza os recursos apenas quando `activeIndex` for 2 e houver rotinas selecionadas.
          A lógica a seguir realiza os seguintes passos:
          
          1. Verifica se `activeIndex` é igual a 2 e se há rotinas selecionadas (`selectedRoutines.length > 0`).
          2. Se a condição for verdadeira, renderiza um container (`Flex`) com os recursos associados às rotinas selecionadas.
          3. Se `listResources` não estiver vazio, filtra `listRoutines` para incluir apenas as rotinas que estão na lista de rotinas selecionadas.
          4. Para cada rotina, renderiza o nome da rotina em um `Text` e um checkbox para cada recurso relacionado a essa rotina.
          5. Os checkboxes mantêm a persistência da seleção de recursos através de `isChecked`.
          6. Se `listResources` estiver vazio, um spinner é exibido para indicar carregamento.

          Cada checkbox possui um manipulador de evento (`onChange`) que chama a função `handleResourceChange` para atualizar a seleção dos recursos.
        */}
        {activeIndex === 2 && selectedRoutines.length > 0 && (
          <Flex as="article" flex="4" m={4} mt={2} ml={8} gap={2} direction="column">
            {listResources && listResources.length > 0 ? (
              <>
                {listRoutines &&
                  listRoutines
                    .filter(
                      (routine) =>
                        routine.id === selectedRoutines.find((selectedRoutine) => selectedRoutine === routine.id),
                    )
                    .map((routine) => (
                      <Flex key={routine.id} direction="column" gap={2}>
                        <Text as="h2" fontSize={14} fontWeight="bold">
                          {routine.nome}
                        </Text>
                        {listResources
                          .filter((resource) => resource.rotinaId === routine.id)
                          .map((resource) => (
                            <Checkbox
                              key={resource.id}
                              fontWeight={500}
                              isChecked={selectedResources.includes(resource.id)} // Persistência da seleção dos recursos
                              onChange={(e) => handleResourceChange(e.target.checked, resource)} // Lidar com a seleção dos recursos
                            >
                              {resource.nome}
                            </Checkbox>
                          ))}
                      </Flex>
                    ))}
              </>
            ) : (
              <Flex align="center" p={8} justify="center">
                <Spinner thickness="4px" speed="0.65s" color="blue.500" size="xl" />
              </Flex>
            )}
          </Flex>
        )}
      </Flex>
    </Flex>
  )
}
