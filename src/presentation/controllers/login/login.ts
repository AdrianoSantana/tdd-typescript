import { Authentication } from "../../../domain/usecases/authentication";
import { InvalidParamError, MissingParamError } from "../../errors";
import { badRequest, ok, serverError, unauthorized } from "../../helpers/http-helpers";
import { Validation } from "../../helpers/validators/validation";
import { Controller, HttpRequest, HttpResponse } from "../../protocols";

export class LoginController implements Controller {
  constructor(
    private readonly authentication: Authentication,
    private readonly validation: Validation
  ){}
  
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { email, password } = httpRequest.body
      const error = this.validation.validate(httpRequest.body)
      if (error)
        return badRequest(error)
    
      const token = await this.authentication.auth(email, password)
      if (!token)
        return unauthorized()

      return ok({ accessToken: token })
    } catch (error) {
      return serverError(error)
    }
  }
}