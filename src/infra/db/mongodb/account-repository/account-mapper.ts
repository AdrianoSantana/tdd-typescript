import { AccountModel } from "../../../../domain/models/account";

export const AccountMapper = (account: any): AccountModel => {
  const { _id, ...accountWithoutId } = account
  return Object.assign({}, accountWithoutId, { id: _id.toHexString() }) as AccountModel
}