import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';
import { jwtDecode } from 'jwt-decode';

dotenv.config();

interface IGetId extends Request {
    user?: object | string;
}

export const authenticateJWT = (
    req: IGetId,
    res: Response,
    next: NextFunction
) => {
    // Pega o cabeçalho 'Authorization'
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(403).json({ message: 'Acesso negado.' });
    }

    // Extrai o token removendo o Bearer
    const token = authHeader.split(' ')[1];

    if (!process.env.JWT_SECRET) {
        console.error(
            'JWT_SECRET não está definido nas variáveis de ambiente do backend.'
        );
        return res
            .status(500)
            .json({ message: 'Erro de configuração do servidor.' });
    }

    // Verifica o token usando jwt.verify
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            // Se houver erro na verificação (expirado, inválido, etc.)
            console.error('Erro de verificação do token:', err.message);
            return res
                .status(401)
                .json({ message: 'Token inválido ou expirado.' });
        }

        // Se a verificação for bem-sucedida, o token é válido.
        try {
            const decodedPayload = jwtDecode(token); // Usa jwt-decode para obter o payload
            req.user = decodedPayload; // Atribui o payload decodificado a req.user
            next();
        } catch (decodeError) {
            console.error(
                'Erro ao decodificar token após verificação:',
                decodeError
            );
            return res
                .status(401)
                .json({ message: 'Token malformado após verificação' });
        }
    });
};
