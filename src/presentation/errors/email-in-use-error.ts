export class EmailInUseError extends Error {
  constructor() {
    super(`The received email is already in use`)
    this.name = 'The received email is already in use'
  }
}