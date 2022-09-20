import { LogMongoRepository } from "../../../infra/db/mongodb/log/log-repository";
import { Controller } from "../../../presentation/protocols";
import { LogControllerDecorator } from "../../decorators/log";

export const makeLogController = (controller: Controller): LogControllerDecorator => {
    const logMongoRepository = new LogMongoRepository()
    return new LogControllerDecorator(controller, logMongoRepository)
}