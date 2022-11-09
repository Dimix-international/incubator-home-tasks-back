import bcrypt from 'bcrypt'


export const authService = {
    async checkCredentials (clientPassword: string, userHashPassword: string): Promise<Boolean> {
        return await bcrypt.compare(clientPassword, userHashPassword);
    },
}
