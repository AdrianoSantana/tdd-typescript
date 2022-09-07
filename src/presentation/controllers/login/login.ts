import { InvalidParamError, MissingParamError } from "../../errors";
import { badRequest, serverError } from "../../helpers/http-helpers";
import { Controller, HttpRequest, HttpResponse } from "../../protocols";
import { EmailValidator } from "../sign-up/sign-up-protocols";

export class LoginController implements Controller {
  constructor(private readonly emailValidator: EmailValidator){}
  
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
    } catch (error) {
      return serverError(error)
    }
  }
}