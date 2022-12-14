import jwt from 'jsonwebtoken'
import { JwtAdapter } from './jwt-adapter'


jest.mock('jsonwebtoken', () => ({
  async sign (): Promise<string> {
    return 'any_token'
  }
}))

const makeSut = (): JwtAdapter => {
  return new JwtAdapter('secret')
}

describe('JWT ADAPTER', () => {
  test('Should call jwtSign with correct values', async () => {
    const sut = makeSut()
    const signSpy = jest.spyOn(jwt, 'sign')
    await sut.generate('any_id')
    expect(signSpy).toHaveBeenCalledWith({ id: 'any_id'}, 'secret')
  })

  test('Should return a token on success', async () => {
    const sut = makeSut()
    const accessToken = await sut.generate('any_id')
    expect(accessToken).toEqual('any_token')
  })

  test('Should throw if sign throws', async () => {
    const sut = makeSut()
    jest.spyOn(jwt, 'sign').mockImplementationOnce(() => { throw new Error() })
    const promise = sut.generate('any_id')
    expect(promise).rejects.toThrow()
  })
})