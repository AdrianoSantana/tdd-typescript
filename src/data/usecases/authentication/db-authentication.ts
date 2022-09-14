import { 
  Authentication, 
  AuthenticationModel, 
  HashComparer, 
  LoadAccountByEmailRepository, 
  Encrypter, 
  UpdateAcessTokenRepository } from "./db-authentication-protocols"

export class DbAuthentication implements Authentication {
  constructor(
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashComparer: HashComparer,
    private readonly encrypter: Encrypter,
    private readonly updateAccessTokenRepository: UpdateAcessTokenRepository
  ) {}
  async auth(authentication: AuthenticationModel): Promise<string> {
    const account = await this.loadAccountByEmailRepository.load(authentication.email)
    if (account) {
      const isValid = await this.hashComparer.comparer(authentication.password, account.password)
      if (isValid) {
        const accessToken = await this.encrypter.generate(account.id)
        await this.updateAccessTokenRepository.updateAccessToken(account.id, accessToken)
        return accessToken
      }
    }
    return null
  }
}