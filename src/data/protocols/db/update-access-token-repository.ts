import { AccountModel } from "../../usecases/add-account/db-add-account-protocols";

export interface UpdateAcessTokenRepository {
  update(id: string, token: string): Promise<void>
}