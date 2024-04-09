import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryUserRepository } from '../repositories/in-memory/in-memory-user-repository'
import { AuthenticateUseCase } from './authenticate'
import { hash } from 'bcryptjs'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'

let userRepository: InMemoryUserRepository
let sut: AuthenticateUseCase

describe('Authenticate Use Case', () => {
  beforeEach(() => {
    userRepository = new InMemoryUserRepository()
    sut = new AuthenticateUseCase(userRepository)
  })

  it('should be able to authenticate user', async () => {
    await userRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      passwordHash: await hash('123456', 8),
    })

    const { user } = await sut.execute({
      email: 'johndoe@example.com',
      password: '123456',
    })
    expect(user.id).toEqual(expect.any(String))
  })

  it('not should be able to authenticate user with wrong email', async () => {
    await userRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      passwordHash: await hash('123456', 8),
    })

    await expect(() =>
      sut.execute({
        email: 'emailNotExist',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('not should be able to authenticate user with wrong password', async () => {
    await userRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      passwordHash: await hash('123456', 8),
    })

    await expect(() =>
      sut.execute({
        email: 'johndoe@example.com',
        password: 'pspfqpjfwqfjwqpf',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
