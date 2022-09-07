import { MissingParamError } from "../../errors"
import { badRequest } from "../../helpers/http-helpers"
import { HttpRequest } from "../../protocols"
import { LoginController } from "./login"

interface sutTypes {
  sut: LoginController
}

const makeSut = (): sutTypes => {
  const sut = new LoginController()
  return {
    sut
  }
}

describe('Login', () => {
  test('Should return 400 if no email is provided', async () => {
    const { sut } = makeSut()
    const httpRequest: HttpRequest = {
      body: {
        password: 'any_password'
      }
    }
    const HttpResponse = await sut.handle(httpRequest)
    expect(HttpResponse).toEqual(badRequest(new MissingParamError('email')))
  })

  test('Should return 400 if no password is provided', async () => {
    const { sut } = makeSut()
    const httpRequest: HttpRequest = {
      body: {
        email: 'any_email@mail.com'
      }
    }
    const HttpResponse = await sut.handle(httpRequest)
    expect(HttpResponse).toEqual(badRequest(new MissingParamError('password')))
  })
})