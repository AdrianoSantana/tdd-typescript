import { Authentication } from "../../../domain/usecases/authentication";
import { InvalidParamError, MissingParamError } from "../../errors";
import { UnathourizedError } from "../../errors/unauthorized-error";
import { badRequest, serverError, unauthorized } from "../../helpers/http-helpers";
import { Controller, HttpRequest, HttpResponse } from "../../protocols";
import { EmailValidator } from "../sign-up/sign-up-protocols";

export class LoginController implements Controller {
  constructor(
    private readonly emailValidator: EmailValidator,
    private readonly authentication: Authentication
  ){}
  
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = ['email', 'password']
      const { email, password } = httpRequest.body

      for (const field of requiredFields) {
        if (!httpRequest.body[field])
          return badRequest(new MissingParamError(field))
      }

      const isValidEmail = this.emailValidator.isValid(email)
      if (!isValidEmail)
        return badRequest(new InvalidParamError('email'))

      const token = await this.authentication.auth(email, password)
      if (!token)
        return unauthorized()
    } catch (error) {
      return serverError(error)
    }
  }
}