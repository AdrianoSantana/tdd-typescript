import { rejects } from "assert"
import { Encrypter } from "../../protocols/encrypter"
import { DbAddAccount } from "./db-add-account"

interface sutTypes {
  sut: DbAddAccount,
  encrypterStub: Encrypter
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
  const sut = new DbAddAccount(encrypterStub)
  return {
    encrypterStub,
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
})