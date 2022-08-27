import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

const SALT: number = 12

jest.mock('bcrypt', () => ({
    async hash(): Promise<string> {
        return new Promise((resolve) => resolve('hash'))
    }
}))

describe('Bcrypt Adapter', () => {
    test('Should call bcrypt with correct value', async () => {
        const sut = new BcryptAdapter(SALT)
        const hashSpy = jest.spyOn(bcrypt, 'hash')
        await sut.encrypt('any_value')
        expect(hashSpy).toHaveBeenCalledWith('any_value', SALT)
    })
    test('Should returns a hash on success', async () => {
        const sut = new BcryptAdapter(SALT)
        const hash = await sut.encrypt('any_value')
        expect(hash).toEqual('hash')
    })
})