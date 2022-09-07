import { MissingParamError } from "../../errors";
import { badRequest } from "../../helpers/http-helpers";
import { Controller, HttpRequest, HttpResponse } from "../../protocols";

export class LoginController implements Controller {
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    if (!httpRequest.body.email)
      return await badRequest(new MissingParamError('email'))
    if (!httpRequest.body.password)
      return await badRequest(new MissingParamError('password'))
  }
}