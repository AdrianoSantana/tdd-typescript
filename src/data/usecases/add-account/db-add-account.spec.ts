import { Encrypter } from "../../protocols/encrypter"
import { DbAddAccount } from "./db-add-account"

interface sutTypes {
  sut: DbAddAccount,
  encrypterStub: Encrypter
}

const makeSut = (): sutTypes => {
  class EncrypterStub {
    async encrypt(value: string): Promise<string> {
      return new Promise(resolve => resolve('hashed_password'))
    }
  }

  const encrypterStub = new EncrypterStub()
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
})