import { Request, Response } from 'express';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

export const adminLogin = async (req: Request, res: Response): Promise<void> => {
    try {
        const { password } = req.body;

        if (!password) {
            res.status(400).json({
                success: false,
                error: 'Password is required'
            });
            return;
        }

        if (password === ADMIN_PASSWORD) {
            res.cookie('adminToken', password, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 24 * 60 * 60 * 1000
            });

            res.json({
                success: true,
                message: 'Admin access granted'
            });
        } else {
            res.status(401).json({
                success: false,
                error: 'Invalid password'
            });
        }

    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Login failed'
        });
    }
};

export const adminLogout = (_req: Request, res: Response): void => {
    res.clearCookie('adminToken');
    res.json({
        success: true,
        message: 'Logged out successfully'
    });
};

export const adminStatus = (req: Request, res: Response): void => {
    const token = req.cookies?.adminToken;

    res.json({
        success: true,
        isAdmin: token === ADMIN_PASSWORD
    });
};