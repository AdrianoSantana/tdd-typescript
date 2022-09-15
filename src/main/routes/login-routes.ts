import { Router } from "express";
import { adapteRoute } from "../adapters/express/express-router-adapter";
import { makeLoginController } from "../factories/login/login-factory";
import { makeSignUpController } from "../factories/signup/signup-factory";

export default (router: Router): void => {
  router.post('/signup', adapteRoute(makeSignUpController()))
  router.post('/login', adapteRoute(makeLoginController()))
}