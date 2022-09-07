import { InvalidParamError, MissingParamError } from "../../errors"
import { badRequest, serverError } from "../../helpers/http-helpers"
import { HttpRequest } from "../../protocols"
import { EmailValidator } from "../sign-up/sign-up-protocols"
import { LoginController } from "./login"

interface sutTypes {
  sut: LoginController,
  emailValidatorStub: EmailValidator
}

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

const makeSut = (): sutTypes => {
  const emailValidatorStub = makeEmailValidator()
  const sut = new LoginController(emailValidatorStub)
  return {
    sut,
    emailValidatorStub
  }
}

const makeHttpRequest = (): HttpRequest => ({
  body: {
    email: 'any_email@mail.com',
    password: 'any_password'
  }
})

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

  test('Should call 400 if invalid email is provided', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const httpRequest = makeHttpRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')))
  })

  test('Should call emailValidator with correct email', async () => {
    const { sut, emailValidatorStub } = makeSut()
    const emailValidatorSpy = jest.spyOn(emailValidatorStub, 'isValid')
    const httpRequest = makeHttpRequest()
    await sut.handle(httpRequest)
    expect(emailValidatorSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  test('Should return 500 if emailValidator throws', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => { throw new Error() })
    const httpRequest = makeHttpRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(serverError(new Error()))
  })
})