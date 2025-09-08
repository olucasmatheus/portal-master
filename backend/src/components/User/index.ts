import { Request, Response } from 'express';
import { Types } from 'mongoose';
import User from './model';
import Joi from 'joi';
import { hashPassword } from '../../config/bcrypt/bcrypt';
import { compareSync } from 'bcrypt';
import { generateToken } from '../../config/auth/AuthService';
import { IGetId } from '../../types/userAuth';

export async function getUser(req: Request, res: Response): Promise<void> {
    // #swagger.tags = ['Users']
    // #swagger.summary = 'Busca um usuário por id'
    // #swagger.description = 'Busca um usuário com base no ID fornecido pela URL'
    const id = req.params.id;
    /*
        #swagger.tags = ['Users']
        #swagger.summary = 'Busca e exibe um usuário pelo seu id'

    */
    try {
        if (!Types.ObjectId.isValid(id)) {
            res.status(400).json({ error: 'ID inválido' });
            return;
        }
        const user = await User.findById(id);
        if (!user) {
            res.status(404).json({ error: 'Usuário não encontrado' });
            return;
        }

        res.status(200).json(user);
        return;
    } catch (error) {
        console.error(`Erro ao buscar o usuário: ${error}`);
        res.status(500).json({ error: 'Erro interno do servidor' });
        return;
    }
}
export async function getAllUsers(req: IGetId, res: Response): Promise<void> {
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
        const users = await User.find();
        if (!users) {
            res.status(404).json({ message: 'Não há usuários cadastrados' });
            return;
        }

        res.status(200).json(users);
        return;
    } catch (error) {
        res.status(500).json({ error });
        return;
    }
}
export async function createUser(req: Request, res: Response): Promise<void> {
    /*
        #swagger.tags = ['Users']
        #swagger.summary = 'Cria um novo usuário'
        #swagger.description = 'Cria um novo usuário com os dados fornecidos no corpo da requisição. Retorna o usuário criado ou um erro em caso de falha.'
        #swagger.parameters['body'] = {
            in: 'body',
            schema: { $ref: '#/definitions/createUser' }
    } 
    */
    const schema = Joi.object({
        name: Joi.string().min(4).required(),
        password: Joi.string().min(8).required(),
        email: Joi.string().email().required(),
        profile: Joi.string().required(),
    });
    /*
        #swagger.tags = ['Users']
        #swagger.summary = 'Cria um novo usuário'
    */
    try {
        let { name, password, email, profile } = req.body;

        const checkEmailExist = await User.findOne({ email });

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

        const hash = await hashPassword(password);
        const user = new User({
            name,
            password: hash,
            email,
            profile,
        });

        await user.save();

        res.status(201).json({ message: 'Usuário criado com sucesso!' });
    } catch (error) {
        console.error('Erro ao criar usuário:', error);
        res.status(500).json({ error: 'Erro interno do servidor.' + error });
    }
}

export async function loginUser(req: Request, res: Response): Promise<void> {
    // #swagger.tags = ['Users']
    // #swagger.summary = 'Autentica um usuário'
    // #swagger.description = 'Autentica um usuário com as credenciais fornecidas no corpo da requisição. Retorna um token de acesso em caso de sucesso ou um erro de autenticação.'
    /*
    #swagger.parameters['body'] = {
        in: 'body',
        schema: { $ref: '#/definitions/login' }
    } 
    */
    const schema = Joi.object({
        password: Joi.string().required(), //validacao dos dados
        email: Joi.string().email().required(),
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

        const findEmail = await User.findOne({ email });
        if (!findEmail) {
            console.error('Não há ninguém com este email.');
            res.status(400).json({
                message: 'Não há ninguém cadastrado com esse email',
            });
            return;
        }
        const matchPassword = compareSync(password, findEmail.password); //verificação do bcrypt
        if (matchPassword) {
            const token = generateToken(
                (findEmail._id as Types.ObjectId).toString(),
                findEmail.profile
            );

            res.status(200).json({
                message: `Logado com sucesso como ${findEmail.name}!`,
                token,
            });
            return;
        }

        res.status(401).json({ message: 'Usuário ou senha incorretos' });
        return;
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro interno do servidor' });
        return;
    }
}
export async function deleteUser(req: IGetId, res: Response): Promise<void> {
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
        if (!Types.ObjectId.isValid(id)) {
            res.status(400).json({ error: 'ID inválido' });
            return;
        }
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            res.status(404).json({
                error: 'Usuário não encontrado para ser deletado',
            });
            return;
        }

        res.status(200).json({
            message: `Usuário ${user.name} deletado com sucesso!`,
        });
    } catch (error) {
        res.status(500).json({ error });
    }
}

export async function putUser(req: Request, res: Response): Promise<void> {
    // #swagger.tags = ['Users']
    // #swagger.summary = 'Atualiza um usuário pelo ID'
    // #swagger.description = 'Atualiza os dados de um usuário específico com base no ID fornecido na URL e os dados fornecidos no corpo da requisição. Retorna o usuário atualizado ou um erro em caso de falha.'
    const id = req.params.id;
    const updates = req.body;
    /*
        #swagger.tags = ['Users']
        #swagger.summary = 'Modifica os dados de um usuário pelo seu id'

    */
    if (!Types.ObjectId.isValid(id)) {
        res.status(400).json({ error: 'ID inválido.' });
        return;
    }
    updates.password = await hashPassword(updates.password);

    try {
        const user = await User.findByIdAndUpdate(id, updates, {
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
    } catch (error) {
        console.error('Erro ao atualizar usuário:', error);
        res.status(500).json({ error: 'Erro interno do servidor.' });
    }
}
