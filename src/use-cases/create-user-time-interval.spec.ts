import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryUserTimeIntervalRepository } from '../repositories/in-memory/in-memory-user-time-interal-repository'
import { CreateUserTimeIntervalUseCase } from './create-user-time-interval'
import { InMemoryUserRepository } from '../repositories/in-memory/in-memory-user-repository'
import { hash } from 'bcryptjs'
import { UserNotExistsError } from './errors/user-not-exists-error'

let userTimeIntervalRepository: InMemoryUserTimeIntervalRepository
let userRepository: InMemoryUserRepository
let sut: CreateUserTimeIntervalUseCase

describe('Create User Time Interval Use Case', () => {
  beforeEach(() => {
    userTimeIntervalRepository = new InMemoryUserTimeIntervalRepository()
    userRepository = new InMemoryUserRepository()
    sut = new CreateUserTimeIntervalUseCase(
      userTimeIntervalRepository,
      userRepository,
    )
  })

  it('should be able to create user time interval', async () => {
    const user = await userRepository.create({
      email: 'johndoe@example.com',
      name: 'John Doe',
      passwordHash: await hash('123456', 8),
    })

    const { userTimeInterval } = await sut.execute({
      timeStartInMinutes: 480,
      timeEndInMinutes: 1080,
      userId: user.id,
      weekDay: 1,
    })

    expect(userTimeInterval.id).toEqual(expect.any(String))
  })

  it('not should be able with wrong user id', async () => {
    await expect(() =>
      sut.execute({
        timeStartInMinutes: 480,
        timeEndInMinutes: 1080,
        userId: 'userNotExists',
        weekDay: 1,
      }),
    ).rejects.toBeInstanceOf(UserNotExistsError)
  })
})
