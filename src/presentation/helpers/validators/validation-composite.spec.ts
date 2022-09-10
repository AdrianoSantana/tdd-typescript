import { MissingParamError } from "../../errors"
import { Validation } from "../../protocols/validation"
import { ValidationComposite } from "./validation-composite"

interface SutTypes {
  sut: ValidationComposite,
  validationStubs: Validation[]
}

const makeValidationStubs = (): Validation[] => {
  class ValidationStub implements Validation {
    validate(input: any): Error {
      return null
    }
  }
  return [new ValidationStub() , new ValidationStub() ]
}
const makeSut = (): SutTypes => {
  const validationStubs = makeValidationStubs()
  const sut = new ValidationComposite(validationStubs)
  return {
    sut,
    validationStubs
  }
}
describe('Validation Composite', () => {
  test('Should return an error if any validation fails', () => {
    const { sut, validationStubs } = makeSut()
    jest.spyOn(validationStubs[0], 'validate').mockReturnValueOnce(new MissingParamError('field'))
    const validateResult = sut.validate({ field: 'any_value' })
    expect(validateResult).toEqual(new MissingParamError('field'))
  })

  test('Should return the first error if more then one validation fails', () => {
    const { sut, validationStubs } = makeSut()
    jest.spyOn(validationStubs[0], 'validate').mockReturnValueOnce(new Error())
    jest.spyOn(validationStubs[1], 'validate').mockReturnValueOnce(new MissingParamError('field'))
    const validateResult = sut.validate({ field: 'any_value' })
    expect(validateResult).toEqual(new Error())
  })
})