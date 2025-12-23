import { Request, Response, NextFunction } from 'express';

export const adminAuth = (req: Request, res: Response, next: NextFunction): void => {
    const token = req.headers['x-admin-token'] || (req as any).cookies?.adminToken;

    if (token === process.env.ADMIN_PASSWORD) {
        req.isAdmin = true;
        return next();
    }

    res.status(401).json({ error: 'Admin access required' });
};

export const optionalAdminAuth = (req: Request, _res: Response, next: NextFunction): void => {
    const token = req.headers['x-admin-token'] || (req as any).cookies?.adminToken;
    req.isAdmin = token === process.env.ADMIN_PASSWORD;
    next();
};