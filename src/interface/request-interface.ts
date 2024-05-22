import { Request } from 'express';

export interface RequestWithUser extends Request {
    user: {
        userId: string;
        fullName: string;
        email: string;
        role: string;
    };
}
