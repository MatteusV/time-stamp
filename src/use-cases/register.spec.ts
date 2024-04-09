import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryUserRepository } from '../repositories/in-memory/in-memory-user-repository'
import { RegisterUseCase } from './register'
import { compare } from 'bcryptjs'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

let userRepository: InMemoryUserRepository
let sut: RegisterUseCase

describe('Register Use Case', () => {
  beforeEach(() => {
    userRepository = new InMemoryUserRepository()
    sut = new RegisterUseCase(userRepository)
  })

  it('should be able to register user', async () => {
    const { user } = await sut.execute({
      email: 'johndoe@example.com',
      name: 'John Doe',
      password: '123456',
    })
    expect(user.id).toEqual(expect.any(String))
  })

  it('should be able to encrypt the user password', async () => {
    const password = '123456'

    const { user } = await sut.execute({
      email: 'johndoe@example.com',
      name: 'John Doe',
      password,
    })

    const isPasswordCorrectlyHashed = await compare(password, user.passwordHash)

    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('It should not be possible to register more than one user with the same email', async () => {
    const email = 'johndoe@example.com'

    await sut.execute({
      email,
      name: 'John Doe',
      password: '123456',
    })

    await expect(() =>
      sut.execute({
        email,
        name: 'teste',
        password: 'teste',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
