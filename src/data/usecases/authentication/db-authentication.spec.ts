import { 
  AccountModel,
  Authentication, 
  AuthenticationModel, 
  DbAuthentication, 
  HashComparer, 
  LoadAccountByEmailRepository, 
  Encrypter, 
  UpdateAcessTokenRepository } from "./db-authentication-protocols"

const makeFakeAccount = (): AccountModel => ({
  id: 'any_id',
  email: 'any_email@mail.com',
  name: 'any_name',
  password: 'hashed_password'
})

const makeLoadAccountByEmailRepositoryStub = ():LoadAccountByEmailRepository  => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async loadByEmail(email: string): Promise<AccountModel> {
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

const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async generate(value: string): Promise<string> {
      return await 'any_token'
    }
  }
  return new EncrypterStub()
}

const makeUpdateAcessTokenRepository = (): UpdateAcessTokenRepository => {
  class UpdateAcessTokenRepositoryStub implements UpdateAcessTokenRepository {
    updateAccessToken(id: string, token: string): Promise<void> {
      return
    }
  }
  return new UpdateAcessTokenRepositoryStub()
}

interface SutTypes {
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository,
  sut: Authentication,
  hashComparerStub: HashComparer,
  encrypterStub: Encrypter,
  updateAcessTokenRepositoryStub: UpdateAcessTokenRepository
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepositoryStub()
  const hashComparerStub = MakeHashComparer()
  const encrypterStub = makeEncrypter()
  const updateAcessTokenRepositoryStub = makeUpdateAcessTokenRepository()
  const sut = new DbAuthentication(
    loadAccountByEmailRepositoryStub,
    hashComparerStub, 
    encrypterStub, 
    updateAcessTokenRepositoryStub
  )
  return {
    hashComparerStub,
    loadAccountByEmailRepositoryStub,
    encrypterStub,
    updateAcessTokenRepositoryStub,
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
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
    await sut.auth(makeFakeAuthentication())
    expect(loadSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  test.skip('Should throw if loadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockRejectedValueOnce(() => new Error())
    const promiseAuth = sut.auth(makeFakeAuthentication())
    expect(promiseAuth).rejects.toThrow()
  })

  test('Should return null if LoadAccountByEmailRepository return null', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockResolvedValueOnce(null)
    const accessToken = await sut.auth(makeFakeAuthentication())
    expect(accessToken).toBeNull()
  })

  test('Should call hashComparer with correct value', async () => {
    const { sut, hashComparerStub } = makeSut()
    const comparerSpy = jest.spyOn(hashComparerStub, 'comparer')
    await sut.auth(makeFakeAuthentication())
    expect(comparerSpy).toHaveBeenCalledWith('any_password', 'hashed_password')
  })

  test.skip('Should throw if hashComparer throws', async () => {
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
    const { sut, encrypterStub } = makeSut()
    const generateSpy = jest.spyOn(encrypterStub, 'generate')
    await sut.auth(makeFakeAuthentication())
    expect(generateSpy).toHaveBeenCalledWith('any_id')
  })

  test.skip('Should throw if encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut()
    jest.spyOn(encrypterStub, 'generate').mockRejectedValueOnce(() => new Error())
    const promiseAuth = sut.auth(makeFakeAuthentication())
    expect(promiseAuth).rejects.toThrow()
  })

  test('Should return a token if correct values are provided', async () => {
    const { sut } = makeSut()
    const accessToken = await sut.auth(makeFakeAuthentication())
    expect(accessToken).toBe('any_token')
  })

  test('Should call update acessAcount with correct values', async () => {
    const { sut, updateAcessTokenRepositoryStub } = makeSut()
    const updateSpy = jest.spyOn(updateAcessTokenRepositoryStub, 'updateAccessToken')
    await sut.auth(makeFakeAuthentication())
    expect(updateSpy).toHaveBeenCalledWith('any_id', 'any_token')
  })

  test.skip('Should throw if update acessAcount throws', async () => {
    const { sut, updateAcessTokenRepositoryStub } = makeSut()
    jest.spyOn(updateAcessTokenRepositoryStub, 'updateAccessToken').mockRejectedValueOnce(() => new Error())
    const promiseAuth = sut.auth(makeFakeAuthentication())
    expect(promiseAuth).rejects.toThrow()
  })
})