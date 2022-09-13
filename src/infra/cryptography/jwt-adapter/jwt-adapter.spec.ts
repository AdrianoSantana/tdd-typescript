import jwt from 'jsonwebtoken'
import { JwtAdapter } from './jwt-adapter'


jest.mock('jsonwebtoken', () => ({
  async sign (): Promise<string> {
    return 'any_token'
  }
}))

describe('JWT ADAPTER', () => {
  test('Should call jwtSign with correct values', async () => {
    const sut = new JwtAdapter('secret')
    const signSpy = jest.spyOn(jwt, 'sign')
    await sut.generate('any_id')
    expect(signSpy).toHaveBeenCalledWith({ id: 'any_id'}, 'secret')
  })

  test('Should return a token on success', async () => {
    const sut = new JwtAdapter('secret')
    const accessToken = await sut.generate('any_id')
    expect(accessToken).toEqual('any_token')
  })
})