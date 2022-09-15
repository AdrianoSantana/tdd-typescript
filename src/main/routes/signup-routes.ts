import { Router } from "express";
import { adapteRoute } from "../adapters/express/express-router-adapter";
import { makeSignUpController } from "../factories/signup/signup-factory";

export default (router: Router): void => {
  router.post('/signup', adapteRoute(makeSignUpController()))
}