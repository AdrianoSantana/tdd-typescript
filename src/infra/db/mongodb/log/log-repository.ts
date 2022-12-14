import { LogErrorRepository } from "../../../../data/protocols/db/log/log-error-repository";
import { MongoHelper } from "../helpers/mongodb-helper";

export class LogMongoRepository implements LogErrorRepository {

  async logError(stackError: string): Promise<void> {
    const errorCollection = await MongoHelper.getCollection('errors')
    await errorCollection.insertOne({
      stack: stackError,
      data: new Date(Date.now())
    })
  }
}