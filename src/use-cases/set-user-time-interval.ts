import { UserTimeInterval } from "@prisma/client"
import { UserTimeIntervalRepository } from "../repositories/user-time-interval-repository"
import { UserTimeIntervalAlreadyExistsError } from "./errors/user-time-interval-already-exists-error"
import { convertTimeStringToMinutes } from "../utils/convert-time-string-to-minutes"

interface SetTimeIntervalUseCaseRequest {
  weekDay: number
  enabled: boolean
  startTime: string
  endTime: string
  userId: string
}

interface SetUserTimeIntervalUseCaseResponse {
  userTimeInterval: UserTimeInterval
}

export class SetTimeIntervalUseCase {
  constructor(private userTimeIntervalRepository: UserTimeIntervalRepository) {}

  async execute({enabled, endTime, startTime,weekDay , userId}: SetTimeIntervalUseCaseRequest): Promise<SetUserTimeIntervalUseCaseResponse> {
    const userTimeIntervalsAlreadyExists = await this.userTimeIntervalRepository.fetchManyByUserId(userId)
 
    if(userTimeIntervalsAlreadyExists) throw new UserTimeIntervalAlreadyExistsError()

    const startTimeInMinutes = convertTimeStringToMinutes(startTime)
    const endTimeInMinutes = convertTimeStringToMinutes(endTime)

   const userTimeInterval = await this.userTimeIntervalRepository.create({
      time_end_in_minutes: endTimeInMinutes,
      time_start_in_minutes: startTimeInMinutes,
      user_id: userId,
      week_day: weekDay,
    })

    return { userTimeInterval }
  }
}