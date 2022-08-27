import { Encrypter } from "../../data/protocols/encrypter";
import bcrypt from 'bcrypt'

export class BcryptAdapter implements Encrypter {
    constructor(private salt: number) {}
    async encrypt(value: string): Promise<string> {
        return await bcrypt.hash(value, this.salt)
    }
}