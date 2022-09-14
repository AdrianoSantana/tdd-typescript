import { AccountModel } from "../../usecases/add-account/db-add-account-protocols";

export interface UpdateAcessTokenRepository {
  updateAccessToken(id: string, token: string): Promise<void>
}