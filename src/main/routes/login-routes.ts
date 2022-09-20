import { Router } from "express";
import { adapteRoute } from "../adapters/express/express-router-adapter";
import { makeLoginController } from "../factories/controllers/login/login-controller-factory";
import { makeSignUpController } from "../factories/controllers/signup/signup-controller-factory";

export default (router: Router): void => {
  router.post('/signup', adapteRoute(makeSignUpController()))
  router.post('/login', adapteRoute(makeLoginController()))
}