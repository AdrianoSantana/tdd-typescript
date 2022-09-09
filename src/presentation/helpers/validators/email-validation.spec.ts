import { AccountModel, AddAccount, AddAccountModel, EmailValidator } from "../../controllers/sign-up/sign-up-protocols"
import { HttpRequest } from "../../protocols"
import { EmailValidation } from "./email-validation"
import { Validation } from "./validation"

interface SutTypes {
  sut: EmailValidation,
  emailValidatorStub: EmailValidator,
  addAccountStub: AddAccount,
  validationStub: Validation
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
  const sut = new EmailValidation('email', emailValidatorStub)
  return {
    sut,
    emailValidatorStub,
    addAccountStub,
    validationStub
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
  test('should call emailValidator with correct email', async() => {
    const { sut, emailValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    const httpRequest = makeHttpRequest()
    sut.validate({ email: 'any_email@mail.com'})
    expect(isValidSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  test('should return status code 500 if emailValidator throws', async() => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => { throw new Error() })
    expect(sut.validate).toThrow()
  })
})