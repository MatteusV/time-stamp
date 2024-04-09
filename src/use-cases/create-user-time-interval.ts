import { UserTimeInterval } from '@prisma/client'
import { UserTimeIntervalRepository } from '../repositories/user-time-interal-repository'
import { UsersRepository } from '../repositories/user-repository'
import { UserNotExistsError } from './errors/user-not-exists-error'

interface CreateUserTimeIntervalUseCaseRequest {
  userId: string
  weekDay: number
  timeStartInMinutes: number
  timeEndInMinutes: number
}

interface CreateUserTimeIntervalUseCaseResponse {
  userTimeInterval: UserTimeInterval
}

export class CreateUserTimeIntervalUseCase {
  constructor(
    private userTimeIntervalRepository: UserTimeIntervalRepository,
    private usersRepository: UsersRepository,
  ) {}

  async execute({
    timeEndInMinutes,
    timeStartInMinutes,
    userId,
    weekDay,
  }: CreateUserTimeIntervalUseCaseRequest): Promise<CreateUserTimeIntervalUseCaseResponse> {
    const userExists = await this.usersRepository.findById(userId)

    if (!userExists) throw new UserNotExistsError()

    const userTimeInterval = await this.userTimeIntervalRepository.create({
      time_end_in_minutes: timeEndInMinutes,
      time_start_in_minutes: timeStartInMinutes,
      user_id: userId,
      week_day: weekDay,
    })

    return { userTimeInterval }
  }
}
