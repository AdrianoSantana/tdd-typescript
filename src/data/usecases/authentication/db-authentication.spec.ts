import { 
  AccountModel,
  Authentication, 
  AuthenticationModel, 
  DbAuthentication, 
  HashComparer, 
  LoadAccountByEmailRepository, 
  TokenGenerator, 
  UpdateAcessTokenRepository } from "./db-authentication-protocols"

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

const makeUpdateAcessTokenRepository = (): UpdateAcessTokenRepository => {
  class UpdateAcessTokenRepositoryStub implements UpdateAcessTokenRepository {
    update(id: string, token: string): Promise<void> {
      return
    }
  }
  return new UpdateAcessTokenRepositoryStub()
}

interface SutTypes {
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository,
  sut: Authentication,
  hashComparerStub: HashComparer,
  tokenGeneratorStub: TokenGenerator,
  updateAcessTokenRepositoryStub: UpdateAcessTokenRepository
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepositoryStub()
  const hashComparerStub = MakeHashComparer()
  const tokenGeneratorStub = makeTokenGenerator()
  const updateAcessTokenRepositoryStub = makeUpdateAcessTokenRepository()
  const sut = new DbAuthentication(
    loadAccountByEmailRepositoryStub,
    hashComparerStub, 
    tokenGeneratorStub, 
    updateAcessTokenRepositoryStub
  )
  return {
    hashComparerStub,
    loadAccountByEmailRepositoryStub,
    tokenGeneratorStub,
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

  test('Should throw if tokenGenerator throws', async () => {
    const { sut, tokenGeneratorStub } = makeSut()
    jest.spyOn(tokenGeneratorStub, 'generate').mockRejectedValueOnce(() => new Error())
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
    const updateSpy = jest.spyOn(updateAcessTokenRepositoryStub, 'update')
    await sut.auth(makeFakeAuthentication())
    expect(updateSpy).toHaveBeenCalledWith('any_id', 'any_token')
  })

  test('Should throw if update acessAcount throws', async () => {
    const { sut, updateAcessTokenRepositoryStub } = makeSut()
    jest.spyOn(updateAcessTokenRepositoryStub, 'update').mockRejectedValueOnce(() => new Error())
    const promiseAuth = sut.auth(makeFakeAuthentication())
    expect(promiseAuth).rejects.toThrow()
  })
})