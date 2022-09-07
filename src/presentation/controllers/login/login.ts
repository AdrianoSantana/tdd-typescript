import { InvalidParamError, MissingParamError } from "../../errors";
import { badRequest } from "../../helpers/http-helpers";
import { Controller, HttpRequest, HttpResponse } from "../../protocols";
import { EmailValidator } from "../sign-up/sign-up-protocols";

export class LoginController implements Controller {
  constructor(private readonly emailValidator: EmailValidator){}
  
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    if (!httpRequest.body.email)
      return await badRequest(new MissingParamError('email'))
    if (!httpRequest.body.password)
      return await badRequest(new MissingParamError('password'))

    const isValidEmail = this.emailValidator.isValid(httpRequest.body.email)
    if (!isValidEmail)
      return badRequest(new InvalidParamError('email'))
  }
}