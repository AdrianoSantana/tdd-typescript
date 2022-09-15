import { DbAddAccount } from "../../../data/usecases/add-account/db-add-account";
import { BcryptAdapter } from "../../../infra/cryptography/bcrypt-adapter/bcrypt-adapter";
import { AccountMongoRepository } from "../../../infra/db/mongodb/account/account-mongo-repository";
import { LogMongoRepository } from "../../../infra/db/mongodb/log/log-repository";
import { SignUpController } from "../../../presentation/controllers/sign-up/sign-up-controller";
import { Controller } from "../../../presentation/protocols";
import { EmailValidatorAdapter } from "../../../utils/email-validator-adapter";
import { LogControllerDecorator } from "../../decorators/log";
import { makeSignUpValidation } from "./signup-validation";

export const makeSignUpController = (): Controller => {
  const salt = 12;
  const bcryptAdapter = new BcryptAdapter(salt)
  const accountMongoRepository = new AccountMongoRepository()
  const dbAddAccount = new DbAddAccount(bcryptAdapter, accountMongoRepository )
  const validationComposite = makeSignUpValidation()
  const signUpController = new SignUpController(dbAddAccount, validationComposite);
  const logRepository = new LogMongoRepository()
  return new LogControllerDecorator(signUpController, logRepository)
}