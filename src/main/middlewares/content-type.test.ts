import request from 'supertest'
import app from '../config/app'

describe('Content-Type MIDDLEWARE', () => {
  test('Should return default content-type as Json', async () => {
    app.get('/test-content-type', (request, response) => {
      response.send()
    })
    await request(app)
      .get('/test-content-type')
      .expect('content-type', /json/)
  })
})