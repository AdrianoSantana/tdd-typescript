import { Controller, HttpRequest } from "../../presentation/protocols";
import { Request, Response } from "express";

export const adapteRoute = (controller: Controller): any => {
  return async (request: Request, response: Response) => {
    const httpRequest: HttpRequest = {
      body: request.body
    }
    const httpResponse = await controller.handle(httpRequest)
    if (httpResponse.statusCode === 200)
      response.status(httpResponse.statusCode).send(httpResponse.body)
    else
      response.status(httpResponse.statusCode).send(httpResponse.body.message)
  }
}