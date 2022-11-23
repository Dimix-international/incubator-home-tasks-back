import {UsersRepository} from "../../repositories/users/users-repository";
import bcrypt from "bcrypt";
import {HASH_SALT_ROUNDS} from "../../constants/general/general";
import {User} from "./classes";
import {v4 as uuidv4} from 'uuid';

export class UserService {

    constructor(protected usersRepository: UsersRepository) {}

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
            createdAt: newUser.createdAt,
            activationCode: newUser.activationCode,
            countSendEmailsActivated: newUser.countSendEmailsActivated
        }
    }

    async activateUser (userId: string): Promise<Boolean> {
        const {matchedCount} = await this.usersRepository.activateUser(userId);
        return !!matchedCount;
    }

    async updateCountSendEmails (userId: string): Promise<Boolean> {
        const {matchedCount} = await this.usersRepository.updateCountSendEmails(userId);
        return !!matchedCount;
    }

    async createNewActivatedCode (userId: string): Promise<String | null> {
        const code = uuidv4();
        const {matchedCount} = await this.usersRepository.createNewActivatedCode(userId, code);
        return !!matchedCount ? code : null;
    }

    async _generateHash(password: string) {
        return await bcrypt.hash(password, HASH_SALT_ROUNDS);
    }
}
