import { AddAccountRepository } from "../../protocols/db/add-account-repository"
import { AccountModel ,AddAccount, AddAccountModel, Encrypter } from "./db-add-account-protocols"

export class DbAddAccount implements AddAccount {
  constructor(private encrypter: Encrypter, private addAccountRepository: AddAccountRepository) {}

  async add(accountData: AddAccountModel): Promise<AccountModel> {
    const hashedPassword = await this.encrypter.encrypt(accountData.password)
    const account = await this.addAccountRepository.add(Object.assign({}, accountData, { password: hashedPassword }))
    return account
  }
}