"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Estagiario_1 = require("../components/Estagiario");
const AuthMiddleware_1 = require("../config/auth/AuthMiddleware");
const router = (0, express_1.Router)();
//@ts-ignore
//prettier-ignore
router.get('/', Estagiario_1.getEstagiarios);
// @ts-ignore
router.post('/', AuthMiddleware_1.authenticateJWT, Estagiario_1.cadEstagiario);
// @ts-ignore
router.put('/:id/story', AuthMiddleware_1.authenticateJWT, Estagiario_1.updateEstagiario);
// @ts-ignore
router.delete('/:id/story', AuthMiddleware_1.authenticateJWT, Estagiario_1.deleteEstagiario);
//configurando o multer
exports.default = router;
