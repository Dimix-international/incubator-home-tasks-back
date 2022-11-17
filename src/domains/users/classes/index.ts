import {v4 as uuidv4} from 'uuid';

export class User {
    id: string;
    createdAt: Date

    constructor(public login: string,
                public password: string,
                public email: string
    ) {
        this.id = uuidv4();
        this.createdAt = new Date();
    }
}