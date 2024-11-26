import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { getListUsersQueryKey, useCreateUser } from './http/generated/api'
import { useQueryClient } from '@tanstack/react-query'

const createUserSchema = z.object({
  name: z.string().min(3, 'Nome precisa pelo menos 3 caracteres.')
})

type CreateUserSchema = z.infer<typeof createUserSchema>

function CreateUser() {
  const queryClient = useQueryClient()

  const { handleSubmit, register, reset, formState: { errors } } = useForm<CreateUserSchema>({
    resolver: zodResolver(createUserSchema)
  })

  const { mutateAsync: createUser } = useCreateUser()

  async function handleCreatUser(data: CreateUserSchema) {
    await createUser({ data: { name: data.name } })

    await queryClient.invalidateQueries({
      queryKey: getListUsersQueryKey()
    })

    reset()
  }

  return (
    <>
      <form onSubmit={handleSubmit(handleCreatUser)}>
        <input type="text" {...register('name')} />
        {errors.name && <span>{errors.name.message}</span>}
        <button type="submit">Criar usuário</button>
      </form>
    </>
  )
}

export default CreateUser
