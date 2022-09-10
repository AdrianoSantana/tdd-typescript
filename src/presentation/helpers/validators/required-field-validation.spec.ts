import { MissingParamError } from "../../errors"
import { RequiredFieldValidation } from "./required-field-validation"

describe('Required Field Validation', () => {
  test('Should returning a missing param if validation fails', () => {
    const sut = new RequiredFieldValidation('any_field')
    const validateResponse = sut.validate({ name: 'any_name' })
    expect(validateResponse).toEqual(new MissingParamError('any_field'))
  })
})