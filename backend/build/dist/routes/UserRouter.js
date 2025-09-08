"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const components_1 = require("../components");
const AuthMiddleware_1 = require("../config/auth/AuthMiddleware");
const router = (0, express_1.Router)();
router.post('/createUser', components_1.UserComponent.createUser);
router.post('/login', components_1.UserComponent.loginUser);
//@ts-ignore
router.delete('/deleteUser/:id', AuthMiddleware_1.authenticateJWT, components_1.UserComponent.deleteUser);
//@ts-ignore
router.get('/user/:id', AuthMiddleware_1.authenticateJWT, components_1.UserComponent.getUser);
//@ts-ignore
router.get('/getAll', AuthMiddleware_1.authenticateJWT, components_1.UserComponent.getAllUsers);
//@ts-ignore
router.put('/user/:id', AuthMiddleware_1.authenticateJWT, components_1.UserComponent.putUser);
//@ts-ignore
router.get('/getAll', AuthMiddleware_1.authenticateJWT, components_1.UserComponent.getAllUsers);
exports.default = router;
