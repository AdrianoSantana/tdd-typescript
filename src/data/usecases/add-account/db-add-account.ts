import { AddAccountRepository } from "../../protocols/db/add-account-repository"
import { AccountModel ,AddAccount, AddAccountModel, Hasher } from "./db-add-account-protocols"

export class DbAddAccount implements AddAccount {
  constructor(private hasher: Hasher, private addAccountRepository: AddAccountRepository) {}

  async add(accountData: AddAccountModel): Promise<AccountModel> {
    const hashedPassword = await this.hasher.hash(accountData.password)
    const account = await this.addAccountRepository.add(Object.assign({}, accountData, { password: hashedPassword }))
    return account
  }
}