import { DbAuthentication } from "../../../data/usecases/authentication/db-authentication";
import { BcryptAdapter } from "../../../infra/cryptography/bcrypt-adapter/bcrypt-adapter";
import { JwtAdapter } from "../../../infra/cryptography/jwt-adapter/jwt-adapter";
import { AccountMongoRepository } from "../../../infra/db/mongodb/account/account-mongo-repository";
import { LogMongoRepository } from "../../../infra/db/mongodb/log/log-repository";
import { LoginController } from "../../../presentation/controllers/login/login-controller";
import { ValidationComposite } from "../../../presentation/helpers/validators";
import { Controller } from "../../../presentation/protocols";
import env from "../../config/env";
import { LogControllerDecorator } from "../../decorators/log";
import { makeLoginValidation } from "./login-validation-factory";

export const makeLoginController = (): Controller => {
  const salt = 12
  const accountMongoRepository = new AccountMongoRepository()
  const bcryptAdapter = new BcryptAdapter(salt)
  const jwtAdapter = new JwtAdapter(env.jwtSecret)
  const authentication = new DbAuthentication(accountMongoRepository, bcryptAdapter, jwtAdapter, accountMongoRepository)
  const validation = makeLoginValidation()
  const loginController = new LoginController(authentication, validation)
  const logErrorRepository = new LogMongoRepository()
  return new LogControllerDecorator(loginController, logErrorRepository)
}