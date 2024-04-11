export class UserTimeIntervalAlreadyExistsError extends Error {
  constructor() {
    super('User time interval already exists.')
  }
}
