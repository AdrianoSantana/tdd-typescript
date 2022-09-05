import { LogErrorRepository } from "../../data/protocols/log-error-repository"
import { AccountModel } from "../../domain/models/account"
import { serverError } from "../../presentation/helpers/http-helpers"
import { Controller, HttpRequest, HttpResponse } from "../../presentation/protocols"
import { LogControllerDecorator } from "./log"

const makeHttpRequest = ():HttpRequest => ({
  body: {
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password',
    passwordConfirmation: 'any_password'
  }
})

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_account',
  email: 'valid_account@mail.com',
  password: 'valid_password'
})

const makeController = (): Controller => {
  class ControllerStub implements Controller {
    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
      const httpResponse: HttpResponse = {
        body: makeFakeAccount(),
        statusCode: 200
      }
      return httpResponse
    }
  }
  const controllerStub = new ControllerStub()
  return controllerStub
}

const makeLogErrorRepository = (): LogErrorRepository => {
  class LogErrorRepositoryStub implements LogErrorRepository {
    async log(stackError: string): Promise<void> {
      return new Promise(resolve => resolve())
    }
  }
  return new LogErrorRepositoryStub()
}

interface SutTypes {
  controllerStub: Controller,
  sut: LogControllerDecorator,
  logErrorRepositoryStub: LogErrorRepository
}

const makeSut = (): SutTypes => {
  const controllerStub = makeController()
  const logErrorRepositoryStub = makeLogErrorRepository()
  const sut = new LogControllerDecorator(controllerStub, logErrorRepositoryStub)
  return {
    sut,
    controllerStub,
    logErrorRepositoryStub
  }
}

describe('Log decorator', () => {
  test('Should call controller handle', async () => {
    const { sut, controllerStub } = makeSut()
    const handleSpy = jest.spyOn(controllerStub, 'handle')
    const httpRequest = makeHttpRequest()
    await sut.handle(httpRequest)
    expect(handleSpy).toHaveBeenCalledWith(httpRequest)
  })

  test('Should return the same result of the controller', async () => {
    const { sut, controllerStub } = makeSut()
    const httpRequest: HttpRequest = makeHttpRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual({
      body: makeFakeAccount(),
      statusCode: 200
    })
  })

  test('Should call logDecoratorRepository with correct values', async () => {
    const { sut, logErrorRepositoryStub, controllerStub } = makeSut()
    
    const errorStub = new Error()
    errorStub.stack = 'any_stack'
    
    jest.spyOn(controllerStub, 'handle').mockReturnValueOnce(new Promise(resolve => resolve(serverError(errorStub))))
    const logSpy = jest.spyOn(logErrorRepositoryStub, 'log')
    
    const httpRequest: HttpRequest = makeHttpRequest()
    await sut.handle(httpRequest)
    expect(logSpy).toHaveBeenCalledWith(errorStub.stack)
  })
})