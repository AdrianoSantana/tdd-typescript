import { Authentication, AuthenticationModel } from "../../../domain/usecases/authentication"
import { HashComparer } from "../../protocols/criptography/hash-comparer"
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

interface SutTypes {
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository,
  sut: Authentication,
  hashComparerStub: HashComparer
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepositoryStub()
  const hashComparerStub = MakeHashComparer()
  const sut = new DbAuthentication(loadAccountByEmailRepositoryStub, hashComparerStub)
  return {
    hashComparerStub,
    loadAccountByEmailRepositoryStub,
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

  test('Should call hashcCmpare with correct value', async () => {
    const { sut, hashComparerStub } = makeSut()
    const comparerSpy = jest.spyOn(hashComparerStub, 'comparer')
    await sut.auth(makeFakeAuthentication())
    expect(comparerSpy).toHaveBeenCalledWith('any_password', 'hashed_password')
  })
})