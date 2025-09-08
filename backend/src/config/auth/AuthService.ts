import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

interface JwtPayload {
    userId: string;
    role: string;
}

export const generateToken = (userId: string, role: string): string => {
    const payload: JwtPayload = { userId, role };

    const secretKey = process.env.JWT_SECRET;
    if (!secretKey) {
        throw new Error('o token nao foi informado');
    }

    return jwt.sign(payload, secretKey, { expiresIn: '1h' });
};
