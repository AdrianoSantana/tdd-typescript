import { AddSurvey } from "../../../../domain/usecases/add-survey";
import { badRequest } from "../../../helpers/http/http-helpers";
import { Validation } from "../../../protocols/validation";
import { Controller, HttpRequest, HttpResponse } from "./add-survey-controller-protocols";

export class AddSurveyController implements Controller {
    constructor(
        private readonly validation: Validation,
        private readonly addSurvey: AddSurvey
    ) {}
    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        const error = this.validation.validate(httpRequest.body)
        if (error)
            return badRequest(error)

        await this.addSurvey.add(httpRequest.body)
        return null
    }
}