import { Authentication } from "../../../domain/usecases/authentication";
import { InvalidParamError, MissingParamError } from "../../errors";
import { badRequest, serverError } from "../../helpers/http-helpers";
import { Controller, HttpRequest, HttpResponse } from "../../protocols";
import { EmailValidator } from "../sign-up/sign-up-protocols";

export class LoginController implements Controller {
  constructor(
    private readonly emailValidator: EmailValidator,
    private readonly authentication: Authentication
  ){}
  
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { email, password } = httpRequest.body
      if (!email)
        return await badRequest(new MissingParamError('email'))
      if (!password)
        return await badRequest(new MissingParamError('password'))

      const isValidEmail = this.emailValidator.isValid(email)
      if (!isValidEmail)
        return badRequest(new InvalidParamError('email'))

      await this.authentication.auth(email, password)
    } catch (error) {
      return serverError(error)
    }
  }
}