import {UsersRepository} from "../../repositories/users/users-repository";
import bcrypt from "bcrypt";
import {HASH_SALT_ROUNDS} from "../../constants/general/general";
import {User} from "./classes";

export class UserService {
    private usersRepository: UsersRepository;

    constructor() {
        this.usersRepository = new UsersRepository();
    }


    async deleteUserById(id: string): Promise<Boolean> {
        const {deletedCount} = await this.usersRepository.deleteUser(id);
        return !!deletedCount;
    }

    async createUser (login: string, password: string, email: string) {

        const hashPassword = await this._generateHash(password);

        const newUser = new User(login, hashPassword, email);

        await this.usersRepository.createUser(newUser);

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
