import { AddAccountRepository } from "../../protocols/db/account/add-account-repository"
import { LoadAccountByEmailRepository } from "../authentication/db-authentication-protocols"
import { AccountModel ,AddAccount, AddAccountModel, Hasher } from "./db-add-account-protocols"

export class DbAddAccount implements AddAccount {
  constructor(
    private hasher: Hasher,
    private addAccountRepository: AddAccountRepository,
    private loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
  ) {}

  async add(accountData: AddAccountModel): Promise<AccountModel> {
    const account = await this.loadAccountByEmailRepositoryStub.loadByEmail(accountData.email)
    if (!account) {
      const hashedPassword = await this.hasher.hash(accountData.password)
      const newAccount = await this.addAccountRepository.add(Object.assign({}, accountData, { password: hashedPassword }))
      return newAccount
    }
    return null
  }
}