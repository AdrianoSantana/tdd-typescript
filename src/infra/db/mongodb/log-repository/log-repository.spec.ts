import { Collection } from "mongodb"
import { MongoHelper } from "../helpers/mongodb-helper"
import { LogMongoRepository } from "./log"

let errorCollection: Collection

describe('Log Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL) 
  })

  afterAll(async () => {
      await MongoHelper.disconnect()
  })

  beforeEach(async () => {
      errorCollection = await MongoHelper.getCollection('errors')
      await errorCollection.deleteMany({})
  })

  test('Should create an error log on success ', async () => {
    const sut = new LogMongoRepository()
    await sut.logError('any_stack')
    const count = await errorCollection.countDocuments()
    expect(count).toBe(1)
  })
})