import { User } from '@prisma/client'
import { UsersRepository } from '../repositories/user-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'
import { hash } from 'bcryptjs'

interface RegisterUseCaseRequest {
  name: string
  email: string
  password: string
}

interface RegisterUseCaseResponse {
  user: User
}

export class RegisterUseCase {
  constructor(private userRepository: UsersRepository) {}

  async execute({
    email,
    name,
    password,
  }: RegisterUseCaseRequest): Promise<RegisterUseCaseResponse> {
    const userExistsWithSameEmail = await this.userRepository.findByEmail(email)

    if (userExistsWithSameEmail) throw new UserAlreadyExistsError()

    const passwordHash = await hash(password, 8)

    const user = await this.userRepository.create({
      email,
      name,
      passwordHash,
    })

    return { user }
  }
}
