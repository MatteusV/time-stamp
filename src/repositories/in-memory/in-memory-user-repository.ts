import { Prisma, User } from '@prisma/client'
import { UsersRepository } from '../user-repository'
import { randomUUID } from 'crypto'

export class InMemoryUserRepository implements UsersRepository {
  public items: User[] = []

  async findById(id: string) {
    const user = this.items.find((item) => item.id === id)

    if (!user) return null

    return user
  }

  async findByEmail(email: string) {
    const user = this.items.find((item) => item.email === email)

    if (!user) return null

    return user
  }

  async create(data: Prisma.UserUncheckedCreateInput) {
    const user = {
      id: randomUUID(),
      name: data.name,
      email: data.email,
      passwordHash: data.passwordHash,
    }

    this.items.push(user)

    return user
  }
}
