import { LoginController } from "../../../../presentation/controllers/login/login-controller";
import { Controller } from "../../../../presentation/protocols";
import { makeLogController } from "../../decorators/log-controller-decorator-factory";
import { makeDbAuthenticationFactory } from "../../usecases/db-authentication-factory";
import { makeLoginValidation } from "./login-validation-factory";

export const makeLoginController = (): Controller => {
  return makeLogController(new LoginController(makeDbAuthenticationFactory(), makeLoginValidation()))
}