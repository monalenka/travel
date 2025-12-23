import { Request } from 'express';

declare global {
    namespace Express {
        interface Request {
            isAdmin?: boolean;
            user?: {
                id: string;
                email?: string;
            };
        }
    }
}

export { };