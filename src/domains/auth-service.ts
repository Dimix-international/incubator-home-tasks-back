import {v4 as uuidv4} from "uuid";
import bcrypt from 'bcrypt'
import {UsersRepository} from "../repositories/users/users-repository";

export const authService = {
    async checkCredentials (clientPassword: string, userHahPassword: string): Promise<Boolean> {

        const hashPassword = await this._generateHash(clientPassword);
        return await bcrypt.compare(hashPassword, userHahPassword);
    },
    async createUser (login: string, password: string, email: string) {

        const hashPassword = await this._generateHash(password);

        const createdUser = {
            id: uuidv4(),
            login,
            password: hashPassword,
            email,
            createdAt: new Date()
        };

        await UsersRepository.createUser(createdUser);

        return createdUser;
    },
    async _generateHash(password: string) {
        return await bcrypt.hash(password, 7);
    }
}

type UserType = {
    id: string;
    login: string;
    email: string;
    createdAt: Date
}