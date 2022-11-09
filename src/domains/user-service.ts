import {UsersRepository} from "../repositories/users/users-repository";
import bcrypt from "bcrypt";
import {v4 as uuidv4} from "uuid";
import {HASH_SALT_ROUNDS} from "../constants/general/general";


export const userService = {

    async deleteUserById(id: string): Promise<Boolean> {
        const {deletedCount} = await UsersRepository.deleteUser(id);
        return !!deletedCount;
    },

    async createUser (login: string, password: string, email: string) {

        const hashPassword = await this._generateHash(password);

        const newUser = {
            id: uuidv4(),
            login,
            password: hashPassword,
            email,
            createdAt: new Date()
        };

        await UsersRepository.createUser(newUser);

        return {
            id: newUser.id,
            login: newUser.login,
            email: newUser.email,
            createdAt: newUser.createdAt
        }
    },
    async _generateHash(password: string) {
        return await bcrypt.hash(password, HASH_SALT_ROUNDS);
    }
}