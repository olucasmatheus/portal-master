"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const jwt_decode_1 = require("jwt-decode");
dotenv_1.default.config();
const authenticateJWT = (req, res, next) => {
    try {
        const token = req.headers['x-access-token'];
        if (!token) {
            return res
                .status(403)
                .json({ message: 'Acesso negado. Token não fornecido.' });
        }
        jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const decoded = (0, jwt_decode_1.jwtDecode)(token);
        req.user = decoded;
        next();
    }
    catch (err) {
        return res.status(401).json({ message: 'Token inválido' });
    }
};
exports.authenticateJWT = authenticateJWT;
