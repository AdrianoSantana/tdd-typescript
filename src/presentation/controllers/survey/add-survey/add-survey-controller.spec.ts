import { badRequest } from "../../../helpers/http/http-helpers"
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
    validationStub: Validation
}

const makeValidation = (): Validation => {
    class ValidationStub implements Validation {
        validate(input: any): Error {
            return null
        }
    }
    return new ValidationStub() 
}

const makeSut = (): SutTypes => {
    const validationStub = makeValidation()
    const sut = new AddSurveyController(validationStub)
    return {
        sut,
        validationStub
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
})