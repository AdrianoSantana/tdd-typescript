import { SignUpController } from "../../../../presentation/controllers/login-controllers/signup/sign-up-controller";
import { Controller } from "../../../../presentation/protocols";
import { makeLogController } from "../../decorators/log-controller-decorator-factory";
import { makeDbAddAccount } from "../../usecases/db-add-account/db-add-account";
import { makeDbAuthenticationFactory } from "../../usecases/db-authentication-factory";
import { makeSignUpValidation } from "./signup-validation";

export const makeSignUpController = (): Controller => {
  return makeLogController(new SignUpController(makeDbAddAccount(), makeSignUpValidation(), makeDbAuthenticationFactory()));
}