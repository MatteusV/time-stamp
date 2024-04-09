import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryUserRepository } from '../repositories/in-memory/in-memory-user-repository'
import { hash } from 'bcryptjs'
import { GetProfileUseCase } from './get-profile'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

let userRepository: InMemoryUserRepository
let sut: GetProfileUseCase

describe('Get Profile Use Case', () => {
  beforeEach(() => {
    userRepository = new InMemoryUserRepository()
    sut = new GetProfileUseCase(userRepository)
  })

  it('should be able to get profile user', async () => {
    const createdUser = await userRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      passwordHash: await hash('123456', 8),
    })

    const { user } = await sut.execute({
      userId: createdUser.id,
    })
    expect(user.id).toEqual(expect.any(String))
  })

  it('not should be able to get proile user wit wrong user id', async () => {
    await expect(() =>
      sut.execute({
        userId: 'userNotExist',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
