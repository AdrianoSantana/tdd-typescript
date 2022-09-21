import { AddSurvey, AddSurveyModel } from "../../../../domain/usecases/add-survey"
import { badRequest, serverError } from "../../../helpers/http/http-helpers"
import { Validation } from "../../../protocols/validation"
import { AddSurveyController } from "./add-survey-controller"
import { HttpRequest } from "./add-survey-controller-protocols"

const makeFakeRequest = (): HttpRequest => {
    return {
        body: {
            question: 'any_question',
            answers: [{
                image: 'any_image',
                answer: 'any_answer'
            }]
        }
    }
}

interface SutTypes {
    sut: AddSurveyController,
    validationStub: Validation,
    addSurveyStub: AddSurvey
}

const makeValidation = (): Validation => {
    class ValidationStub implements Validation {
        validate(input: any): Error {
            return null
        }
    }
    return new ValidationStub() 
}

const makeAddSurvey = (): AddSurvey => {
    class AddSurveyStub implements AddSurvey {
        async add(data: AddSurveyModel): Promise<void> {
            return
        }
    }
    return new AddSurveyStub()
}

const makeSut = (): SutTypes => {
    const validationStub = makeValidation()
    const addSurveyStub = makeAddSurvey()
    const sut = new AddSurveyController(validationStub, addSurveyStub)
    return {
        sut,
        validationStub,
        addSurveyStub
    }
}

describe('Add survey controller', () => {
    test('Should call validation with correct values', async () => {
        const { sut, validationStub } = makeSut()
        const validateSpy = jest.spyOn(validationStub, 'validate')
        const httpRequest = makeFakeRequest()
        await sut.handle(httpRequest)
        expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
    })

    test('Should return 400 if validation fails', async () => {
        const { sut, validationStub } = makeSut()
        jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new Error())
        const httpRequest = makeFakeRequest()
        const response = await sut.handle(httpRequest)
        expect(response).toEqual(badRequest(new Error()))
    })

    test('Should call AddSurvey with correct values', async () => {
        const { sut, addSurveyStub } = makeSut()
        const addSpy = jest.spyOn(addSurveyStub, 'add')
        const httpRequest = makeFakeRequest()
        const response = await sut.handle(httpRequest)
        expect(addSpy).toHaveBeenCalledWith(httpRequest.body)
    })

    test('Should return 500 if addSurvey Throws', async () => {
        const { sut, addSurveyStub } = makeSut()
        jest.spyOn(addSurveyStub, 'add').mockRejectedValueOnce(new Error())
        const httpResponse = await sut.handle(makeFakeRequest())
        expect(httpResponse).toEqual(serverError(new Error()))
    })
})