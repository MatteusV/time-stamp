import { Prisma, UserTimeInterval } from '@prisma/client'

export interface UserTimeIntervalRepository {
  create(
    data: Prisma.UserTimeIntervalUncheckedCreateInput,
  ): Promise<UserTimeInterval>
  fetchManyByUserId(userId: string): Promise<UserTimeInterval[] | null>
  findById(id: string): Promise<UserTimeInterval | null>
}
