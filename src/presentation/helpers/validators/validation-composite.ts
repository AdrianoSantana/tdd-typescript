import { Validation } from "./validation";

export class ValidationComposite implements Validation {
  constructor(private readonly validations: Validation[]) {}

  validate(input: any): Error {
    this.validations.forEach((validation) => {
      let error = validation.validate(input)
      if (error)
        return error
    })
    return
  }
}