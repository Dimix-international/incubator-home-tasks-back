import {usersRepository} from "../../repositories/users/users-repository";
import bcrypt from "bcrypt";
import {HASH_SALT_ROUNDS} from "../../constants/general/general";
import {User} from "./classes";

class UserService {
    async deleteUserById(id: string): Promise<Boolean> {
        const {deletedCount} = await usersRepository.deleteUser(id);
        return !!deletedCount;
    }

    async createUser (login: string, password: string, email: string) {

        const hashPassword = await this._generateHash(password);

        const newUser = new User(login, hashPassword, email);

        await usersRepository.createUser(newUser);

        return {
            id: newUser.id,
            login: newUser.login,
            email: newUser.email,
            createdAt: newUser.createdAt
        }
    }

    async _generateHash(password: string) {
        return await bcrypt.hash(password, HASH_SALT_ROUNDS);
    }
}


export const userService = new UserService();