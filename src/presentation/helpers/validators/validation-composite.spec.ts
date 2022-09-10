import { MissingParamError } from "../../errors"
import { Validation } from "./validation"
import { ValidationComposite } from "./validation-composite"

describe('Validation Composite', () => {
  test('Should return an error if any validation fails', () => {
    class ValidationStub implements Validation {
      validate(input: any): Error {
        return new MissingParamError('field')
      }
    }
    const validationStub = new ValidationStub()
    const sut = new ValidationComposite([validationStub])
    const validateResult = sut.validate({ field: 'any_value' })
    expect(validateResult).toEqual(new MissingParamError('field'))
  })
})