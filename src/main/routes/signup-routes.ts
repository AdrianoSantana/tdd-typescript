import { Router } from "express";
import { adapteRoute } from "../adapters/express-router-adapter";
import { makeSignUpController } from "../factories/signup/signup";

export default (router: Router): void => {
  router.post('/signup', adapteRoute(makeSignUpController()))
}