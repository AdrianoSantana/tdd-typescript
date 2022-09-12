import { Hasher } from "../../data/protocols/criptography/hasher";
import bcrypt from 'bcrypt'

export class BcryptAdapter implements Hasher {
    constructor(private salt: number) {}
    async hash(value: string): Promise<string> {
        return await bcrypt.hash(value, this.salt)
    }
}