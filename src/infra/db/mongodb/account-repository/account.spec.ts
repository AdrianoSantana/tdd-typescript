import { MongoClient } from "mongodb"
import { MongoHelper } from "../helpers/mongodb-helper"
import { AccountMongoRepository } from "./account"

describe('Mongodb Account Repository', () => {
    beforeAll(async () => {
        await MongoHelper.connect(process.env.MONGO_URL) 
    })

    afterAll(async () => {
        await MongoHelper.disconnect()
    })

    beforeEach(async () => {
        const accountCollection = await MongoHelper.getCollection('accounts')
        await accountCollection.deleteMany({})
    })

    test('Should return an account on success', async () => {
        const sut = new AccountMongoRepository()
        const account = await sut.add({
            name: 'valid_name',
            email: 'valid_email@mail.com',
            password: 'hashed_password'
        })
        expect(account).toBeTruthy()
        expect(account.name).toBe('valid_name')
        expect(account.email).toBe('valid_email@mail.com')
        expect(account.password).toBe('hashed_password')
    })
})