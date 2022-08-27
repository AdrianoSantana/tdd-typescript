import { AddAccountRepository } from "../../protocols/add-account-repository"
import { Encrypter } from "../../protocols/encrypter"
import { DbAddAccount } from "./db-add-account"
import { AccountModel, AddAccountModel } from "./db-add-account-protocols"

interface sutTypes {
  sut: DbAddAccount,
  encrypterStub: Encrypter,
  addAccountRepositoryStub: AddAccountRepository
}

const makeAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub {
    async add(account: AddAccountModel): Promise<AccountModel> {
      return new Promise(resolve => resolve({
        id: 'valid_id',
        name: 'valid_name',
        email: 'valid_email@mail.com',
        password: 'hashed_password'
      }))
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
    const accountData = {
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'valid_password'
    }
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
    await sut.add(accountData)
    expect(encryptSpy).toHaveBeenCalledWith(accountData.password)
  })

  test('Should throw if encrypter throw', async () => {
    const { sut, encrypterStub } = makeSut() 
    const accountData = {
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'valid_password'
    }
    jest.spyOn(encrypterStub, 'encrypt').mockImplementationOnce(() => new Promise((resolve, reject) => reject(new Error())))
    const accountPromise = sut.add(accountData)
    expect(accountPromise).rejects.toThrow()
  })

  test('Should call dbAddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    const addRepositorySpy = jest.spyOn(addAccountRepositoryStub, 'add')

    const accountData = {
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'valid_password'
    }
    
    await sut.add(accountData)
    expect(addRepositorySpy).toHaveBeenCalledWith({
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'hashed_password'
    })
  })

  test('Should throw if dbAddAccountRepository throw', async () => {
    const { sut, addAccountRepositoryStub } = makeSut() 
    const accountData = {
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'valid_password'
    }
    jest.spyOn(addAccountRepositoryStub, 'add').mockImplementationOnce(() => new Promise((resolve, reject) => reject(new Error())))
    const accountPromise = sut.add(accountData)
    expect(accountPromise).rejects.toThrow()
  })

  test('Should return an account on success', async () => {
    const { sut } = makeSut() 
    const accountData = {
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'valid_password'
    }
    
    const account = await sut.add(accountData)
    expect(account).toEqual({
      id: 'valid_id',
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'hashed_password'
    })
  })
})