import { Collection, MongoClient } from "mongodb"
import { MongoHelper } from "../helpers/mongodb-helper"
import { AccountMongoRepository } from "./account-mongo-repository"

let accountCollection: Collection;

describe('Mongodb Account Repository', () => {
    beforeAll(async () => {
        await MongoHelper.connect(process.env.MONGO_URL) 
    })

    afterAll(async () => {
        await MongoHelper.disconnect()
    })

    beforeEach(async () => {
        accountCollection = await MongoHelper.getCollection('accounts')
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

    test('Should return an account on loadByEmail success', async () => {
        const sut = new AccountMongoRepository()
        await accountCollection.insertOne({
            name: 'valid_name',
            email: 'any_email@mail.com',
            password: 'hashed_password'
        })
        const account = await sut.loadByEmail('any_email@mail.com')
        expect(account).toBeTruthy()
        expect(account.name).toBe('valid_name')
        expect(account.email).toBe('any_email@mail.com')
        expect(account.password).toBe('hashed_password')
    })

    test('Should return null if loadByEmail fails', async () => {
        const sut = new AccountMongoRepository()
        const account = await sut.loadByEmail('any_email@mail.com')
        expect(account).toBeFalsy()
    })

    test('Should update the account access token on generate token success', async () => {
        const sut = new AccountMongoRepository()
        const result = await accountCollection.insertOne({
            name: 'valid_name',
            email: 'any_email@mail.com',
            password: 'hashed_password'
        })
        const accountFinded = await accountCollection.findOne({ _id: result.insertedId })
        expect(accountFinded.accessToken).toBeFalsy()
        
        await sut.updateAccessToken(result.insertedId.toString(), 'any_token')
        const account = await accountCollection.findOne({ _id: result.insertedId })
        
        expect(account).toBeTruthy()
        expect(account.accessToken).toBe('any_token')
    })
})