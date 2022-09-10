import { Validation } from "../../protocols/validation";

export class ValidationComposite implements Validation {
  constructor(private readonly validations: Validation[]) {}

  validate(input: any): Error {
    for (let validation of this.validations) {
      let error = validation.validate(input)
      if (error)
        return error
    }
    return
  }
}