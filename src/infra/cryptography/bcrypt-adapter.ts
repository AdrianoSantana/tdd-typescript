import { Hasher } from "../../data/protocols/criptography/hasher";
import bcrypt from 'bcrypt'
import { HashComparer } from "../../data/protocols/criptography/hash-comparer";

export class BcryptAdapter implements Hasher, HashComparer {
    constructor(private salt: number) {}

    async comparer(password: string, hashed: string): Promise<boolean> {
        return await bcrypt.compare(password, hashed)
    }

    async hash(value: string): Promise<string> {
        return await bcrypt.hash(value, this.salt)
    }
}