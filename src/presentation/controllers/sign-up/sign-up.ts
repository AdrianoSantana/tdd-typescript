import { InvalidParamError, MissingParamError } from "../../errors"
import { badRequest, serverError } from "../../helpers/http-helpers"
import { Controller, EmailValidator, HttpRequest, HttpResponse, AddAccount } from "./sign-up-protocols"

export class SignUpController implements Controller {
  constructor(
    private emailValidator: EmailValidator,
    private addAccount: AddAccount
  ) {}

  handle(httpRequest: HttpRequest): HttpResponse {
    try {
      const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
      for (const field of requiredFields) {
        if (!httpRequest.body[field])
          return badRequest(new MissingParamError(field))
      }

      const { email, password, passwordConfirmation, name } = httpRequest.body
      
      if (password !== passwordConfirmation)
        return badRequest(new InvalidParamError('passwordConfirmation'))

      const isValid = this.emailValidator.isValid(httpRequest.body.email)
      if (!isValid)
        return badRequest(new InvalidParamError('email'))

      this.addAccount.add({ email, name, password })
    } catch (error) {
      return serverError()
    }
  }
}