import { Authentication, AuthenticationModel } from "../../../domain/usecases/authentication"
import { LoadAccountByEmailRepository } from "../../protocols/db/load-account-by-email-repository"
import { AccountModel } from "../add-account/db-add-account-protocols"
import { DbAuthentication } from "./db-authentication"

const makeFakeAccount = (): AccountModel => ({
  id: 'any_id',
  email: 'any_email@mail.com',
  name: 'any_name',
  password: 'hash_password'
})

const makeLoadAccountByEmailRepositoryStub = ():LoadAccountByEmailRepository  => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async load(email: string): Promise<AccountModel> {
      return await makeFakeAccount()
    }
  }
  return new LoadAccountByEmailRepositoryStub()
}

interface SutTypes {
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository,
  sut: Authentication
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepositoryStub()
  const sut = new DbAuthentication(loadAccountByEmailRepositoryStub)
  return {
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
})