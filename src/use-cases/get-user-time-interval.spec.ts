import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryUserTimeIntervalRepository } from '../repositories/in-memory/in-memory-user-time-interal-repository'
import { GetUserTimeIntervalUseCase } from './get-user-time-interval'
import { UserTimeIntervalNotExistsError } from './errors/user-time-interval-not-exists-error'

let userTimeIntervalRepository: InMemoryUserTimeIntervalRepository
let sut: GetUserTimeIntervalUseCase

describe('Create User Time Interval Use Case', () => {
  beforeEach(() => {
    userTimeIntervalRepository = new InMemoryUserTimeIntervalRepository()
    sut = new GetUserTimeIntervalUseCase(userTimeIntervalRepository)
  })

  it('should be able to create user time interval', async () => {
    const createUserTimeInterval = await userTimeIntervalRepository.create({
      time_end_in_minutes: 480,
      time_start_in_minutes: 1080,
      user_id: 'user-01',
      week_day: 1,
    })
    const { userTimeInterval } = await sut.execute({
      userTimeIntervalId: createUserTimeInterval.id,
    })

    expect(userTimeInterval.id).toEqual(expect.any(String))
  })

  it('not should be able with wrong user time interval id', async () => {
    await expect(() =>
      sut.execute({ userTimeIntervalId: 'userTimeIntervalNotExists' }),
    ).rejects.toBeInstanceOf(UserTimeIntervalNotExistsError)
  })
})
