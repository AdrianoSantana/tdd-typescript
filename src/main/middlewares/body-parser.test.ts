import request from 'supertest'
import app from '../config/app'

describe('Body Parser Middleware', () => {
  test('', async() => {
    app.post('/test-body-parser', (request, response) => {
      response.send(request.body)
    })
    await request(app)
      .post('/test-body-parser')
      .send({ name: 'any_name' })
      .expect({ name: 'any_name' })
  })
})