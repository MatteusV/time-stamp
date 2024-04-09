import { Prisma, UserTimeInterval } from '@prisma/client'
import { UserTimeIntervalRepository } from '../user-time-interal-repository'
import { randomUUID } from 'crypto'

export class InMemoryUserTimeIntervalRepository
  implements UserTimeIntervalRepository
{
  public items: UserTimeInterval[] = []

  async create(data: Prisma.UserTimeIntervalUncheckedCreateInput) {
    const userTimeInterval = {
      id: randomUUID(),
      week_day: data.week_day,
      time_start_in_minutes: data.time_start_in_minutes,
      time_end_in_minutes: data.time_end_in_minutes,
      user_id: data.user_id,
    }

    this.items.push(userTimeInterval)

    return userTimeInterval
  }

  async fetchManyByUserId(userId: string) {
    const userTimeIntervals = this.items.filter(
      (item) => item.user_id === userId,
    )

    if (!userTimeIntervals) return null

    return userTimeIntervals
  }

  async findById(id: string) {
    const userTimeIntervals = this.items.find((item) => item.id === id)

    if (!userTimeIntervals) return null

    return userTimeIntervals
  }
}
