import { UserTimeInterval } from '@prisma/client'
import { UserTimeIntervalRepository } from '../repositories/user-time-interal-repository'
import { UserTimeIntervalNotExistsError } from './errors/user-time-interval-not-exists-error'

interface GetUserTimeIntervalUseCaseRequest {
  userTimeIntervalId: string
}

interface GetUserTimeIntervalUseCaseResponse {
  userTimeInterval: UserTimeInterval
}

export class GetUserTimeIntervalUseCase {
  constructor(private userTimeIntervalRepository: UserTimeIntervalRepository) {}

  async execute({
    userTimeIntervalId,
  }: GetUserTimeIntervalUseCaseRequest): Promise<GetUserTimeIntervalUseCaseResponse> {
    const userTimeInterval =
      await this.userTimeIntervalRepository.findById(userTimeIntervalId)

    if (!userTimeInterval) throw new UserTimeIntervalNotExistsError()

    return { userTimeInterval }
  }
}
