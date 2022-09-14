import { AddAccountRepository } from "../../../../data/protocols/db/add-account-repository";
import { LoadAccountByEmailRepository } from "../../../../data/protocols/db/load-account-by-email-repository";
import { AccountModel } from "../../../../domain/models/account";
import { AddAccountModel } from "../../../../domain/usecases/add-account";
import { MongoHelper } from "../helpers/mongodb-helper";

export class AccountMongoRepository implements AddAccountRepository, LoadAccountByEmailRepository {
    async loadByEmail(email: string): Promise<AccountModel> {
        const accountCollection = await MongoHelper.getCollection('accounts')
        const account = await accountCollection.findOne({ email })
        return MongoHelper.mapper(account)
    }

    async add(accountModel: AddAccountModel): Promise<AccountModel> {
        const accountCollection = await MongoHelper.getCollection('accounts')
        const resultOperation = await accountCollection.insertOne(accountModel)
        const accountById = await accountCollection
                                            .findOne({ _id: resultOperation.insertedId })

        return MongoHelper.mapper(accountById)
    }
}