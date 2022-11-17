import {v4 as uuidv4} from 'uuid';

export class Blog {
    id: string;
    createdAt: Date;

    constructor(public name: string,
                public youtubeUrl: string
    ) {
        this.id = uuidv4();
        this.createdAt = new Date();
    }
}