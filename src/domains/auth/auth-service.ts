import bcrypt from 'bcrypt'
import {jwtService} from "../jwt/jwt-service";

class AuthService {
    async checkCredentials (clientPassword: string, userHashPassword: string, payload: UserPayloadType ):
        Promise<CheckCredentialsType | null> {
        const isRightPassword =  await bcrypt.compare(clientPassword, userHashPassword);
        if (isRightPassword) {
            const {accessToken} = await jwtService.createJWT(payload);
            return {accessToken}
        }
        return null
    }
}

export const authService = new AuthService();

type CheckCredentialsType = {
    accessToken: string
}

type UserPayloadType = {
    id: string;
}
