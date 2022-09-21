import { AccountModel } from '../../../../domain/models/account'
import { InvalidParamError, MissingParamError, ServerError } from '../../../errors'
import { EmailValidator, AddAccount,AddAccountModel, HttpRequest  } from './sign-up-controller-protocols'
import { SignUpController } from './sign-up-controller'
import { Validation } from '../../../protocols/validation'
import { badRequest, forbidden, serverError } from '../../../helpers/http/http-helpers'
import { Authentication, AuthenticationModel } from '../../../../domain/usecases/authentication'
import { EmailInUseError } from '../../../errors/email-in-use-error'

interface SutTypes {
  sut: SignUpController,
  emailValidatorStub: EmailValidator,
  addAccountStub: AddAccount,
  validationStub: Validation,
  authenticationStub: Authentication
}

const makeAuthenticationModel = (): AuthenticationModel => {
  return { email: 'any_email@mail.com', password: 'any_password'}
}

const makeAuthentication = (): Authentication => {
  const authModel = makeAuthenticationModel()
  class AuthenticationStub implements Authentication {
    async auth(authenticationModel: AuthenticationModel): Promise<string> {
      return await 'any_token'
    }
  }
  return new AuthenticationStub()
}

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_account',
  email: 'valid_account@mail.com',
  password: 'valid_password'
})

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add(account: AddAccountModel): Promise<AccountModel> {
      return new Promise(resolve => resolve(makeFakeAccount()))
    }
  }
  return new AddAccountStub()
}

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate(input: any): Error {
      return null
    }
  }
  return new ValidationStub()
}

const makeSut = (): SutTypes => {
  const addAccountStub = makeAddAccount()
  const emailValidatorStub = makeEmailValidator()
  const validationStub = makeValidation()
  const authenticationStub = makeAuthentication()
  const sut = new SignUpController(addAccountStub, validationStub, authenticationStub)
  return {
    sut,
    emailValidatorStub,
    addAccountStub,
    validationStub,
    authenticationStub
  }
}

const makeHttpRequest = ():HttpRequest => ({
  body: {
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password',
    passwordConfirmation: 'any_password'
  }
})

describe('SignUpController', () => {
  test('should call addAccount with correct values', async() => {
    const { sut, addAccountStub } = makeSut()
    const isAddSpy = jest.spyOn(addAccountStub, 'add')
    
    const httpRequest = makeHttpRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(isAddSpy).toHaveBeenCalledWith(
      { 
        name: 'any_name', 
        email: 'any_email@mail.com', 
        password: 'any_password' 
    })
  })

  test('should return status code 500 if addAccount throws', async() => {
    const { sut, addAccountStub } = makeSut()
    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(() => {
      return new Promise((resolve, reject) => reject(new Error()))
    })
    
    const httpRequest = makeHttpRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError(new Error().stack))
  })

  test('should return 200 if all values are correct', async() => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'valid_name',
        email: 'valid_email@mail.com.br',
        password: 'valid_password',
        passwordConfirmation: 'valid_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual({ accessToken: 'any_token'})
  })

  test('should call Validation with correct value', async() => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    
    const httpRequest = makeHttpRequest()
    await sut.handle(httpRequest)
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  test('should return 400 if validation returns an error', async() => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('any_field'));
    const httpRequest = {
      body: {
        name: 'valid_name',
        email: 'valid_email@mail.com.br',
        password: 'valid_password',
        passwordConfirmation: 'valid_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('any_field')))
  })

  test('Should call authentication with correct values', async () => {
    const { sut, authenticationStub } = makeSut()
    const authSpy = jest.spyOn(authenticationStub, 'auth')
    const httpRequest = makeHttpRequest()
    await sut.handle(httpRequest)
    expect(authSpy).toHaveBeenCalledWith(makeAuthenticationModel())
  })

  test('Should return 500 if authentication throws', async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'auth').mockRejectedValueOnce(() => { throw new Error() })
    const httpRequest = makeHttpRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  
  test('should return 403 if addAccount returns null', async() => {
    const { sut, addAccountStub } = makeSut()
    jest.spyOn(addAccountStub, 'add').mockResolvedValueOnce(null)
    const httpRequest = {
      body: {
        name: 'valid_name',
        email: 'valid_email@mail.com.br',
        password: 'valid_password',
        passwordConfirmation: 'valid_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(forbidden(new EmailInUseError()))
  })
})