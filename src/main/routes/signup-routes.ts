import { Router, Response, Request } from "express";

export default (router: Router): void => {
  router.post('/signup', (request: Request, response: Response) => {
    response.send({ ok: 'ok'  })
  })
}