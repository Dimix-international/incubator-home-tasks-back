import bcrypt from 'bcrypt'
import {jwtService} from "./jwt-service";
import {ObjectId} from "mongodb";


export const authService = {
    async checkCredentials (clientPassword: string, userHashPassword: string, payload: UserPayloadType ):
        Promise<CheckCredentialsType | null> {
        const isRightPassword =  await bcrypt.compare(clientPassword, userHashPassword);
        if (isRightPassword) {
            const {accessToken} = await jwtService.createJWT(payload);
            return {accessToken}
        } else {
            return null
        }
    },
}

type CheckCredentialsType = {
    accessToken: string
}

type UserPayloadType = {
    id: string;
}
