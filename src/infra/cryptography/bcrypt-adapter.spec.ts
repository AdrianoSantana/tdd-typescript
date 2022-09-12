import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

const SALT: number = 12

jest.mock('bcrypt', () => ({
    async hash(): Promise<string> {
        return new Promise((resolve) => resolve('hash'))
    }
}))

const makeSut = (): BcryptAdapter => {
    const sut = new BcryptAdapter(SALT)
    return sut
}

describe('Bcrypt Adapter', () => {
    test('Should call bcrypt with correct value', async () => {
        const sut = makeSut()
        const hashSpy = jest.spyOn(bcrypt, 'hash')
        await sut.hash('any_value')
        expect(hashSpy).toHaveBeenCalledWith('any_value', SALT)
    })

    test('Should returns a hash on success', async () => {
        const sut = makeSut()
        const hash = await sut.hash('any_value')
        expect(hash).toEqual('hash')
    })

    test('Should throw if bcrypt throws', async () => {
        const sut = makeSut()
        jest.spyOn(bcrypt, 'hash').mockImplementationOnce(
            () => {
              throw new Error()
            }
        )
        const promise = sut.hash('any_value')
        expect(promise).rejects.toThrow()
    })
})