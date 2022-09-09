import { badRequest, serverError, ok } from "../../helpers/http-helpers"
import { Validation } from "../../helpers/validators/validation"
import { Controller, HttpRequest, HttpResponse, AddAccount } from "./sign-up-protocols"

export class SignUpController implements Controller {
  constructor(
    private addAccount: AddAccount,
    private validation: Validation
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error)
        return badRequest(error)

      const { email, password, name } = httpRequest.body

      const account = await this.addAccount.add({ email, name, password })
      return ok(account)
    } catch (error) {
      return serverError(error)
    }
  }
}