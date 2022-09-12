import { AddAccountRepository } from "../../protocols/db/add-account-repository"
import { Encrypter } from "../../protocols/criptography/encrypter"
import { DbAddAccount } from "./db-add-account"
import { AccountModel, AddAccountModel } from "./db-add-account-protocols"

interface sutTypes {
  sut: DbAddAccount,
  encrypterStub: Encrypter,
  addAccountRepositoryStub: AddAccountRepository
}

const makeFakeAccountData = (): AddAccountModel => ({
  name: 'valid_name',
  email: 'valid_email@mail.com',
  password: 'hashed_password'
})

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@mail.com',
  password: 'hashed_password'
})

const makeAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub {
    async add(account: AddAccountModel): Promise<AccountModel> {
      return new Promise(resolve => resolve(makeFakeAccount()))
    }
  }

  return new AddAccountRepositoryStub()
}

const makeEncrypter = (): Encrypter => {
  class EncrypterStub {
    async encrypt(value: string): Promise<string> {
      return new Promise(resolve => resolve('hashed_password'))
    }
  }

  return new EncrypterStub()
}

const makeSut = (): sutTypes => {
  const encrypterStub = makeEncrypter()
  const addAccountRepositoryStub = makeAddAccountRepository()
  const sut = new DbAddAccount(encrypterStub, addAccountRepositoryStub)
  return {
    encrypterStub,
    addAccountRepositoryStub,
    sut
  }
}

describe('Db Add Account', () => {
  test('Should call encrypter with correct password', async () => {
    const { sut, encrypterStub } = makeSut() 
    const accountData = makeFakeAccountData()
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
    await sut.add(accountData)
    expect(encryptSpy).toHaveBeenCalledWith(accountData.password)
  })

  test('Should throw if encrypter throw', async () => {
    const { sut, encrypterStub } = makeSut() 
    const accountData = makeFakeAccountData()
    jest.spyOn(encrypterStub, 'encrypt').mockImplementationOnce(() => new Promise((resolve, reject) => reject(new Error())))
    const accountPromise = sut.add(accountData)
    expect(accountPromise).rejects.toThrow()
  })

  test('Should call dbAddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    const addRepositorySpy = jest.spyOn(addAccountRepositoryStub, 'add')
    const accountData = makeFakeAccountData()
    await sut.add(accountData)
    expect(addRepositorySpy).toHaveBeenCalledWith(makeFakeAccountData())
  })

  test('Should throw if dbAddAccountRepository throw', async () => {
    const { sut, addAccountRepositoryStub } = makeSut() 
    const accountData = makeFakeAccountData()
    jest.spyOn(addAccountRepositoryStub, 'add').mockImplementationOnce(() => new Promise((resolve, reject) => reject(new Error())))
    const accountPromise = sut.add(accountData)
    expect(accountPromise).rejects.toThrow()
  })

  test('Should return an account on success', async () => {
    const { sut } = makeSut() 
    const accountData = makeFakeAccountData()
    const account = await sut.add(accountData)
    expect(account).toEqual(makeFakeAccount())
  })
})