import { AddAccountRepository } from "../../../../data/protocols/add-account-repository";
import { AccountModel } from "../../../../domain/models/account";
import { AddAccountModel } from "../../../../domain/usecases/add-account";
import { MongoHelper } from "../helpers/mongodb-helper";
import { AccountMapper } from "./account-mapper";

export class AccountMongoRepository implements AddAccountRepository {
    async add(accountModel: AddAccountModel): Promise<AccountModel> {
        const accountCollection = MongoHelper.getCollection('accounts')
        const resultOperation = await accountCollection.insertOne(accountModel)
        const accountById = await accountCollection
                                            .findOne({ _id: resultOperation.insertedId })

        return AccountMapper(accountById)
    }
}