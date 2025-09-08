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
exports.cadEstagiario = cadEstagiario;
exports.getEstagiarios = getEstagiarios;
exports.updateEstagiario = updateEstagiario;
exports.deleteEstagiario = deleteEstagiario;
const model_1 = __importDefault(require("./model"));
const joi_1 = __importDefault(require("joi"));
function cadEstagiario(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        // #swagger.tags = ['Estagiários']
        // #swagger.summary = 'Cria um novo estagiário'
        // #swagger.description = 'Cria um novo estagiário com os dados fornecidos no corpo da requisição. Retorna a confirmação de criado ou um erro em caso de falha.'
        /*
            #swagger.parameters['body'] = {
                in: 'body',
                schema: { $ref: '#/definitions/createEstagiario' }
            }
        */
        const user = req.user;
        if (user.role != 'admin') {
            res.status(401).json({
                message: 'Você não possui permissão para executar essa ação',
            });
            return;
        }
        const schema = joi_1.default.object({
            name: joi_1.default.string().min(4).required(),
            email: joi_1.default.string().email().required(),
            role: joi_1.default.string().min(4).optional(),
            company: joi_1.default.string().min(2).required(),
            techStack: joi_1.default.array().items(joi_1.default.string()).default([]),
            bio: joi_1.default.string().optional().default('Sem relato disponível.'),
            story: joi_1.default.string().optional().default('Sem relato disponível.'),
            birth: joi_1.default.date().optional(),
            startDate: joi_1.default.date().required(),
            endDate: joi_1.default.date().optional(),
            social: joi_1.default.object({
                linkedin: joi_1.default.string().uri().optional(),
                github: joi_1.default.string().uri().optional(),
                instagram: joi_1.default.string().uri().optional(),
            }),
        });
        /*
            #swagger.tags = ['Estagiários']
            #swagger.summary = 'Cadastra um estagiário'
    
        */
        try {
            const { name, email, role, company, techStack, bio, story, birth, startDate, endDate, social, } = req.body;
            const { error, value } = schema.validate(req.body);
            const findEmail = yield model_1.default.findOne({ email });
            if (findEmail) {
                res.status(400).json({ message: 'Email duplicado!' });
                return;
            }
            if (error) {
                console.error('Erro de validação', error);
                res.status(400).json({ error: error.details[0].message });
                return;
            }
            const validated = value;
            const newEstagiario = new model_1.default(validated);
            yield newEstagiario.save();
            res.status(201).json({
                message: `Estagiário ${name} cadastrado com sucesso`,
            });
            return;
        }
        catch (error) {
            res.status(500).json({ error });
        }
    });
}
function getEstagiarios(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        // #swagger.tags = ['Estagiários']
        // #swagger.summary = 'Lista todos os estagiários'
        // #swagger.description = 'Retorna uma lista de todos os estagiários que foram cadastrados no sistema.'
        try {
            const estagiarios = yield model_1.default.find();
            /*
            #swagger.tags = ['Estagiários']
        */
            if (!estagiarios) {
                res.status(404).json({
                    message: 'Não há estagiários cadastrados.',
                });
                return;
            }
            res.status(200).json({ estagiarios });
            return;
        }
        catch (error) {
            res.status(500).json({ error });
        }
    });
}
function updateEstagiario(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        // #swagger.tags = ['Estagiarios']
        // #swagger.summary = 'Atualiza as informações de uma estagiario'
        const user = req.user;
        const internId = req.params.id;
        const updates = req.body; //pega todos os dados que serao atualizados
        try {
            if (user.role !== 'admin') {
                res.status(403).json({ message: 'Acesso negado, precisa de um administrador' });
                return;
            }
            const updatedIntern = yield model_1.default.findByIdAndUpdate(internId, updates, // Aplica todas as atualizações
            { new: true, runValidators: true } // Retorna o documento atualizado
            );
            if (!updatedIntern) {
                res.status(404).json({ message: 'Esse estagiario nao foi encontrado' });
                return;
            }
            res.status(200).json({ message: 'Perfil atualizado' });
        }
        catch (error) {
            res.status(500).json({ error: 'Erro interno' });
        }
    });
}
function deleteEstagiario(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        // #swagger.tags = ['Estagiarios']
        // #swagger.summary = 'Deleta o perfil de um estagiario'
        const user = req.user;
        const internId = req.params.id;
        try {
            if (user.role !== 'admin') {
                res.status(403).json({ message: 'Acesso negado. Apenas administradores podem executar esta ação.' });
                return;
            }
            const deletedIntern = yield model_1.default.findByIdAndDelete(internId);
            if (!deletedIntern) {
                res.status(404).json({ message: 'Estagiário não encontrado' });
                return;
            }
            res.status(200).json({ message: `Perfil de ${deletedIntern.name} deletado com sucesso!` });
        }
        catch (error) {
            res.status(500).json({ error: 'Erro interno' });
        }
    });
}
