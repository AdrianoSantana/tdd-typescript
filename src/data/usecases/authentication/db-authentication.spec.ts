import { Authentication, AuthenticationModel } from "../../../domain/usecases/authentication"
import { HashComparer } from "../../protocols/criptography/hash-comparer"
import { TokenGenerator } from "../../protocols/criptography/token-generator"
import { LoadAccountByEmailRepository } from "../../protocols/db/load-account-by-email-repository"
import { AccountModel } from "../add-account/db-add-account-protocols"
import { DbAuthentication } from "./db-authentication"

const makeFakeAccount = (): AccountModel => ({
  id: 'any_id',
  email: 'any_email@mail.com',
  name: 'any_name',
  password: 'hashed_password'
})

const makeLoadAccountByEmailRepositoryStub = ():LoadAccountByEmailRepository  => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async load(email: string): Promise<AccountModel> {
      return await makeFakeAccount()
    }
  }
  return new LoadAccountByEmailRepositoryStub()
}

const MakeHashComparer = (): HashComparer  => {
  class HashComparerStub implements HashComparer {
    async comparer(password: string, hashed: string): Promise<boolean> {
      return await true
    }
  }
  return new HashComparerStub()
}

const makeTokenGenerator = (): TokenGenerator => {
  class TokenGeneratorStub implements TokenGenerator {
    async generate(id: string): Promise<string> {
      return await 'any_token'
    }
  }
  return new TokenGeneratorStub()
}

interface SutTypes {
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository,
  sut: Authentication,
  hashComparerStub: HashComparer,
  tokenGeneratorStub: TokenGenerator
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepositoryStub()
  const hashComparerStub = MakeHashComparer()
  const tokenGeneratorStub = makeTokenGenerator()
  const sut = new DbAuthentication(loadAccountByEmailRepositoryStub, hashComparerStub, tokenGeneratorStub)
  return {
    hashComparerStub,
    loadAccountByEmailRepositoryStub,
    tokenGeneratorStub,
    sut
  }
}

const makeFakeAuthentication = ():AuthenticationModel => ({
  email: 'any_email@mail.com',
  password: 'any_password'
})


describe('DbAuthentication usecase', () => {
  test('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'load')
    await sut.auth(makeFakeAuthentication())
    expect(loadSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  test('Should throw if loadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'load').mockRejectedValueOnce(() => new Error())
    const promiseAuth = sut.auth(makeFakeAuthentication())
    expect(promiseAuth).rejects.toThrow()
  })

  test('Should return null if LoadAccountByEmailRepository return null', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'load').mockResolvedValueOnce(null)
    const accessToken = await sut.auth(makeFakeAuthentication())
    expect(accessToken).toBeNull()
  })

  test('Should call hashComparer with correct value', async () => {
    const { sut, hashComparerStub } = makeSut()
    const comparerSpy = jest.spyOn(hashComparerStub, 'comparer')
    await sut.auth(makeFakeAuthentication())
    expect(comparerSpy).toHaveBeenCalledWith('any_password', 'hashed_password')
  })

  test('Should throw if hashComparer throws', async () => {
    const { sut, hashComparerStub } = makeSut()
    jest.spyOn(hashComparerStub, 'comparer').mockRejectedValueOnce(() => new Error())
    const promiseAuth = sut.auth(makeFakeAuthentication())
    expect(promiseAuth).rejects.toThrow()
  })

  test('Should return null if hashComparer return false', async () => {
    const { sut, hashComparerStub } = makeSut()
    jest.spyOn(hashComparerStub, 'comparer').mockResolvedValueOnce(false)
    const accessToken = await sut.auth(makeFakeAuthentication())
    expect(accessToken).toBeNull()
  })

  test('Should call Token Generator with correct Id', async () => {
    const { sut, tokenGeneratorStub } = makeSut()
    const generateSpy = jest.spyOn(tokenGeneratorStub, 'generate')
    await sut.auth(makeFakeAuthentication())
    expect(generateSpy).toHaveBeenCalledWith('any_id')
  })
})