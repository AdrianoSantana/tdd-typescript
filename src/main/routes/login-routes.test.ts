import { hash } from 'bcrypt';
import { Collection } from 'mongodb'
import request from 'supertest'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongodb-helper'
import app from '../config/app'

let accountCollection: Collection;

describe('Login routes', () => {
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

  describe('POST signup', () => {
    test('Should return 200 on signup', async () => {
      await request(app)
        .post('/api/signup')
        .send({
          name: 'Adriano',
          email: 'drikons@gmail.com',
          password: '123456',
          passwordConfirmation: '123456'
        })
        .expect(200)
    })
  })

  describe('POST login', () => {
    test('Should return 200 on login', async () => {
      const passwordHash = await hash('123456', 12)
      accountCollection.insertOne({
        name: 'Adriano',
        email: 'drikons@gmail.com',
        password: passwordHash,
      })
      await request(app)
        .post('/api/login')
        .send({
          email: 'drikons@gmail.com',
          password: '123456',
        })
        .expect(200)
    })

    test('Should return 401 on login', async () => {
      await request(app)
        .post('/api/login')
        .send({
          email: 'any@mail.com',
          password: '123456',
        })
        .expect(401)
    })
  })
})