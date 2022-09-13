import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

const SALT: number = 12

jest.mock('bcrypt', () => ({
    async hash(): Promise<string> {
        return new Promise((resolve) => resolve('hash'))
    },

    async compare(password: string, hashed: string): Promise<boolean> {
        return await true
    }
}))

const makeSut = (): BcryptAdapter => {
    const sut = new BcryptAdapter(SALT)
    return sut
}

describe('Bcrypt Adapter', () => {
    test('Should call hash with correct value', async () => {
        const sut = makeSut()
        const hashSpy = jest.spyOn(bcrypt, 'hash')
        await sut.hash('any_value')
        expect(hashSpy).toHaveBeenCalledWith('any_value', SALT)
    })

    test('Should returns a valid hash on hash success', async () => {
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

    test('Should call comparer with correct value', async () => {
        const sut = makeSut()
        const compareSpy = jest.spyOn(bcrypt, 'compare')
        await sut.comparer('any_value', 'any_hash')
        expect(compareSpy).toHaveBeenCalledWith('any_value', 'any_hash')
    })

    test('Should returns true if compare succeds', async () => {
        const sut = makeSut()
        const isValid = await sut.comparer('any_value', 'any_has')
        expect(isValid).toEqual(true)
    })
})