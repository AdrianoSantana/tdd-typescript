import { AddAccountRepository } from "../../protocols/db/account/add-account-repository"
import { Hasher } from "../../protocols/criptography/hasher"
import { DbAddAccount } from "./db-add-account"
import { AccountModel, AddAccountModel } from "./db-add-account-protocols"
import { LoadAccountByEmailRepository } from "../authentication/db-authentication-protocols"

interface sutTypes {
  sut: DbAddAccount,
  hasherStub: Hasher,
  addAccountRepositoryStub: AddAccountRepository,
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
}

const makeLoadAccountByEmailRepositoryStub = ():LoadAccountByEmailRepository  => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async loadByEmail(email: string): Promise<AccountModel> {
      return null
    }
  }
  return new LoadAccountByEmailRepositoryStub()
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

const makeHasher = (): Hasher => {
  class HasherStub {
    async hash(value: string): Promise<string> {
      return new Promise(resolve => resolve('hashed_password'))
    }
  }

  return new HasherStub()
}

const makeSut = (): sutTypes => {
  const hasherStub = makeHasher()
  const addAccountRepositoryStub = makeAddAccountRepository()
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepositoryStub()
  const sut = new DbAddAccount(hasherStub, addAccountRepositoryStub, loadAccountByEmailRepositoryStub)
  return {
    hasherStub,
    addAccountRepositoryStub,
    sut,
    loadAccountByEmailRepositoryStub
  }
}

describe('Db Add Account', () => {
  test('Should call hasher with correct password', async () => {
    const { sut, hasherStub } = makeSut() 
    const accountData = makeFakeAccountData()
    const encryptSpy = jest.spyOn(hasherStub, 'hash')
    await sut.add(accountData)
    expect(encryptSpy).toHaveBeenCalledWith(accountData.password)
  })

  test('Should throw if encrypter throw', async () => {
    const { sut, hasherStub } = makeSut() 
    const accountData = makeFakeAccountData()
    jest.spyOn(hasherStub, 'hash').mockImplementationOnce(() => new Promise((resolve, reject) => reject(new Error())))
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

  test('Should return null if loadAccountByEmailRepository not return null', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut() 
    const accountData = makeFakeAccountData()
    jest.spyOn(loadAccountByEmailRepositoryStub,'loadByEmail').mockResolvedValueOnce(makeFakeAccount())
    const account = await sut.add(accountData)
    expect(account).toBeNull()
  })

  test('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
    await sut.add(makeFakeAccountData())
    expect(loadSpy).toHaveBeenCalledWith('valid_email@mail.com')
  })
})