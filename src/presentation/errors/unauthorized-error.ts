export class UnathourizedError extends Error {
  constructor() {
    super(`Unathourized`)
    this.name = 'UnathourizedError'
    this.stack = 'Unauthorized'
  }
}