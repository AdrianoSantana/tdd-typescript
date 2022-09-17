import { MongoHelper } from "../infra/db/mongodb/helpers/mongodb-helper"
import env from './config/env'

MongoHelper.connect(env.mongoUrl)
  .then(async () => {
    const app = (await import("./config/app")).default
    app.listen(env.PORT , () => console.log(`Server running at http://localhost:${env.PORT}`))
  })
  .catch((err) => {
    console.error(err)
  })
