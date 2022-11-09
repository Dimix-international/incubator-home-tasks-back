import {UsersRepository} from "../repositories/users/users-repository";
import {authService} from "./auth-service";


export const userService = {

    async deleteUserById(id: string): Promise<Boolean> {
        const {deletedCount} = await UsersRepository.deleteUser(id);
        return !!deletedCount;
    },

    async createUser (login: string, password: string, email: string) {

        const newUser = await authService.createUser(login, password, email);

        return {
            id: newUser.id,
            login: newUser.login,
            email: newUser.email,
            createdAt: newUser.createdAt
        }
    }
}