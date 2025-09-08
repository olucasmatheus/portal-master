"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUser = getUser;
exports.getAllUsers = getAllUsers;
exports.createUser = createUser;
exports.loginUser = loginUser;
exports.deleteUser = deleteUser;
exports.putUser = putUser;
const mongoose_1 = require("mongoose");
const model_1 = __importDefault(require("./model"));
const joi_1 = __importDefault(require("joi"));
const bcrypt_1 = require("../../config/bcrypt/bcrypt");
const bcrypt_2 = require("bcrypt");
const AuthService_1 = require("../../config/auth/AuthService");
function getUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        // #swagger.tags = ['Users']
        // #swagger.summary = 'Busca um usuário por id'
        // #swagger.description = 'Busca um usuário com base no ID fornecido pela URL'
        const id = req.params.id;
        /*
            #swagger.tags = ['Users']
            #swagger.summary = 'Busca e exibe um usuário pelo seu id'
    
        */
        try {
            if (!mongoose_1.Types.ObjectId.isValid(id)) {
                res.status(400).json({ error: 'ID inválido' });
                return;
            }
            const user = yield model_1.default.findById(id);
            if (!user) {
                res.status(404).json({ error: 'Usuário não encontrado' });
                return;
            }
            res.status(200).json(user);
            return;
        }
        catch (error) {
            console.error(`Erro ao buscar o usuário: ${error}`);
            res.status(500).json({ error: 'Erro interno do servidor' });
            return;
        }
    });
}
function getAllUsers(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        // #swagger.tags = ['Users']
        // #swagger.summary = 'Lista todos os usuários'
        // #swagger.description = 'Retorna uma lista de todos os usuários cadastrados no sistema.'
        // #swagger.summary = 'Busca e exibe todos os usuários'
        try {
            if (req.user.role != 'admin') {
                res.status(401).json({
                    message: 'Você não possui permissão para executar essa ação',
                });
                return;
            }
            const users = yield model_1.default.find();
            if (!users) {
                res.status(404).json({ message: 'Não há usuários cadastrados' });
                return;
            }
            res.status(200).json(users);
            return;
        }
        catch (error) {
            res.status(500).json({ error });
            return;
        }
    });
}
function createUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        /*
            #swagger.tags = ['Users']
            #swagger.summary = 'Cria um novo usuário'
            #swagger.description = 'Cria um novo usuário com os dados fornecidos no corpo da requisição. Retorna o usuário criado ou um erro em caso de falha.'
            #swagger.parameters['body'] = {
                in: 'body',
                schema: { $ref: '#/definitions/createUser' }
        }
        */
        const schema = joi_1.default.object({
            name: joi_1.default.string().min(4).required(),
            password: joi_1.default.string().min(8).required(),
            email: joi_1.default.string().email().required(),
            profile: joi_1.default.string().required(),
        });
        /*
            #swagger.tags = ['Users']
            #swagger.summary = 'Cria um novo usuário'
        */
        try {
            let { name, password, email, profile } = req.body;
            const checkEmailExist = yield model_1.default.findOne({ email });
            if (checkEmailExist) {
                res.status(409).json({
                    message: 'Já existe alguém com esse email.',
                });
                return;
            }
            if (!profile) {
                profile = 'user';
            }
            const { error } = schema.validate({ name, password, email, profile });
            if (error) {
                console.log('Erro de validação', error);
                res.status(400).json({ error: error.details[0].message });
                return;
            }
            const hash = yield (0, bcrypt_1.hashPassword)(password);
            const user = new model_1.default({
                name,
                password: hash,
                email,
                profile,
            });
            yield user.save();
            res.status(201).json({ message: 'Usuário criado com sucesso!' });
        }
        catch (error) {
            console.error('Erro ao criar usuário:', error);
            res.status(500).json({ error: 'Erro interno do servidor.' + error });
        }
    });
}
function loginUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        // #swagger.tags = ['Users']
        // #swagger.summary = 'Autentica um usuário'
        // #swagger.description = 'Autentica um usuário com as credenciais fornecidas no corpo da requisição. Retorna um token de acesso em caso de sucesso ou um erro de autenticação.'
        /*
        #swagger.parameters['body'] = {
            in: 'body',
            schema: { $ref: '#/definitions/login' }
        }
        */
        const schema = joi_1.default.object({
            password: joi_1.default.string().required(), //validacao dos dados
            email: joi_1.default.string().email().required(),
        });
        /*
            #swagger.tags = ['Users']
            #swagger.summary = 'Realiza autenticação e retorna um token jwt'
        */
        try {
            const { email, password } = req.body;
            const { error } = schema.validate({ email, password });
            if (error) {
                console.error('Erro de validação', error);
                res.status(400).json({ error: error.details[0].message });
            }
            const findEmail = yield model_1.default.findOne({ email });
            if (!findEmail) {
                console.error('Não há ninguém com este email.');
                res.status(400).json({
                    message: 'Não há ninguém cadastrado com esse email',
                });
                return;
            }
            const matchPassword = (0, bcrypt_2.compareSync)(password, findEmail.password); //verificação do bcrypt
            if (matchPassword) {
                const token = (0, AuthService_1.generateToken)(findEmail._id.toString(), findEmail.profile);
                res.status(200).json({
                    message: `Logado com sucesso como ${findEmail.name}!`,
                    token,
                });
                return;
            }
            res.status(401).json({ message: 'Usuário ou senha incorretos' });
            return;
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erro interno do servidor' });
            return;
        }
    });
}
function deleteUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        // #swagger.tags = ['Users']
        // #swagger.summary = 'Exclui um usuário pelo ID'
        // #swagger.description = 'Exclui um usuário específico com base no ID fornecido na URL. Retorna uma mensagem de sucesso ou um erro se o usuário não for encontrado.'
        const id = req.params.id;
        /*
            #swagger.tags = ['Users']
            #swagger.summary = 'Deleta um usuário pelo seu id'
        */
        try {
            if (req.user.role != 'admin') {
                res.status(401).json({
                    message: 'Você não possui permissão para executar essa ação',
                });
                return;
            }
            if (!mongoose_1.Types.ObjectId.isValid(id)) {
                res.status(400).json({ error: 'ID inválido' });
                return;
            }
            const user = yield model_1.default.findByIdAndDelete(id);
            if (!user) {
                res.status(404).json({
                    error: 'Usuário não encontrado para ser deletado',
                });
                return;
            }
            res.status(200).json({
                message: `Usuário ${user.name} deletado com sucesso!`,
            });
        }
        catch (error) {
            res.status(500).json({ error });
        }
    });
}
function putUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        // #swagger.tags = ['Users']
        // #swagger.summary = 'Atualiza um usuário pelo ID'
        // #swagger.description = 'Atualiza os dados de um usuário específico com base no ID fornecido na URL e os dados fornecidos no corpo da requisição. Retorna o usuário atualizado ou um erro em caso de falha.'
        const id = req.params.id;
        const updates = req.body;
        /*
            #swagger.tags = ['Users']
            #swagger.summary = 'Modifica os dados de um usuário pelo seu id'
    
        */
        if (!mongoose_1.Types.ObjectId.isValid(id)) {
            res.status(400).json({ error: 'ID inválido.' });
            return;
        }
        updates.password = yield (0, bcrypt_1.hashPassword)(updates.password);
        try {
            const user = yield model_1.default.findByIdAndUpdate(id, updates, {
                new: true, //usuário atualizado
                runValidators: true, //verifica o schema antes de atualizar
            });
            if (!user) {
                res.status(404).json({ error: 'Usuário não encontrado.' });
                return;
            }
            res.status(200).json({
                message: 'Usuário atualizado com sucesso ',
                user,
            });
        }
        catch (error) {
            console.error('Erro ao atualizar usuário:', error);
            res.status(500).json({ error: 'Erro interno do servidor.' });
        }
    });
}
