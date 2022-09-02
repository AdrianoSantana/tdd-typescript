import { AddAccountRepository } from "../../../../data/protocols/add-account-repository";
import { AccountModel } from "../../../../domain/models/account";
import { AddAccountModel } from "../../../../domain/usecases/add-account";
import { MongoHelper } from "../helpers/mongodb-helper";

export class AccountMongoRepository implements AddAccountRepository {
    async add(accountModel: AddAccountModel): Promise<AccountModel> {
        const accountCollection = await MongoHelper.getCollection('accounts')
        const resultOperation = await accountCollection.insertOne(accountModel)
        const accountById = await accountCollection
                                            .findOne({ _id: resultOperation.insertedId })

        return MongoHelper.mapper(accountById)
    }
}