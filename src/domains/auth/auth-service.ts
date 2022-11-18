import bcrypt from 'bcrypt'
import {JwtService} from "../jwt/jwt-service";

export class AuthService {
    jwtService: JwtService;

    constructor() {
        this.jwtService = new JwtService();
    }


    async checkCredentials (clientPassword: string, userHashPassword: string, payload: UserPayloadType ):
        Promise<CheckCredentialsType | null> {
        const isRightPassword =  await bcrypt.compare(clientPassword, userHashPassword);
        if (isRightPassword) {
            const {accessToken} = await this.jwtService.createJWT(payload);
            return {accessToken}
        }
        return null
    }
}

type CheckCredentialsType = {
    accessToken: string
}

type UserPayloadType = {
    id: string;
}