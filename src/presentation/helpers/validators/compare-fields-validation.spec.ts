import { InvalidParamError } from "../../errors"
import { CompareFieldsValidation } from "./compare-fields-validation"

const makeSut = (): CompareFieldsValidation => {
  return new CompareFieldsValidation('any_field', 'field_to_compare')
}
describe('Compare Fields Validation', () => {
  test('Should returning a invalid param error if validation fails', () => {
    const sut = makeSut()
    const validateResponse = sut.validate({ any_field: 'any_value', field_to_compare: 'another_value' })
    expect(validateResponse).toEqual(new InvalidParamError('field_to_compare'))
  })

  test('Should not return if validation succeds', () => {
    const sut = makeSut()
    const validateResponse = sut.validate({ any_field: 'any_value', field_to_compare: 'any_value' })
    expect(validateResponse).toBeFalsy()
  })
})