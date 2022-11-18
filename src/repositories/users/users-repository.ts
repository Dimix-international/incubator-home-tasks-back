import {UsersCollection} from "../db";


export class UsersRepository {
    async deleteUser(id: string){
        return await UsersCollection.deleteOne({id})
    }
    async createUser(data: CreateUserType) {
        return await UsersCollection.insertOne(data)
    }
}

type CreateUserType = {
    id: string;
    login: string;
    email: string;
    password: string;
    createdAt: Date;
}