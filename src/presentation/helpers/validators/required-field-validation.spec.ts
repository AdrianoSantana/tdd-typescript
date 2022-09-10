import { MissingParamError } from "../../errors"
import { RequiredFieldValidation } from "./required-field-validation"

const makeSut = (): RequiredFieldValidation => {
  return new RequiredFieldValidation('any_field')
}
describe('Required Field Validation', () => {
  test('Should returning a missing param if validation fails', () => {
    const sut = makeSut()
    const validateResponse = sut.validate({ name: 'any_name' })
    expect(validateResponse).toEqual(new MissingParamError('any_field'))
  })

  test('Should not return if validation succeds', () => {
    const sut = makeSut()
    const validateResponse = sut.validate({ any_field: 'any_value' })
    expect(validateResponse).toBeFalsy()
  })
})