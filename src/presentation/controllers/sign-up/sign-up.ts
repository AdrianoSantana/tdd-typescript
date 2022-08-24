import { InvalidParamError, MissingParamError } from "../../errors"
import { badRequest, serverError, ok } from "../../helpers/http-helpers"
import { Controller, EmailValidator, HttpRequest, HttpResponse, AddAccount } from "./sign-up-protocols"

export class SignUpController implements Controller {
  constructor(
    private emailValidator: EmailValidator,
    private addAccount: AddAccount
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
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

      const account = await this.addAccount.add({ email, name, password })
      return ok(account)
    } catch (error) {
      return serverError()
    }
  }
}