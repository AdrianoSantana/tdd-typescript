import { LogErrorRepository } from "../../data/protocols/log-error-repository"
import { Controller, HttpRequest, HttpResponse } from "../../presentation/protocols"

export class LogControllerDecorator implements Controller {
  constructor(
    private readonly controller: Controller,
    private readonly logError: LogErrorRepository
  ) {}
  
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const httpResponse = await this.controller.handle(httpRequest)
    if (httpResponse.statusCode === 500)
      this.logError.log(httpResponse.body.stack)
    return httpResponse
  }

}