import {UsersCollection} from "../db";


class UsersRepository {
    async deleteUser(id: string){
        return await UsersCollection.deleteOne({id})
    }
    async createUser(data: CreateUserType) {
        return await UsersCollection.insertOne(data)
    }
}

export const usersRepository = new UsersRepository();

type CreateUserType = {
    id: string;
    login: string;
    email: string;
    password: string;
    createdAt: Date;
}