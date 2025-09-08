import { Request, Response } from 'express';
import Estagiario from './model';
import Joi from 'joi';
import { IGetId } from '../../types/userAuth';

export async function cadEstagiario(
    req: Request,
    res: Response
): Promise<void> {
    // #swagger.tags = ['Estagiários']
    // #swagger.summary = 'Cria um novo estagiário'
    // #swagger.description = 'Cria um novo estagiário com os dados fornecidos no corpo da requisição. Retorna a confirmação de criado ou um erro em caso de falha.'
    /*
        #swagger.parameters['body'] = {
            in: 'body',
            schema: { $ref: '#/definitions/createEstagiario' }
        } 
    */
    const user = (req as IGetId).user;
    if (user.role != 'admin') {
        res.status(401).json({
            message: 'Você não possui permissão para executar essa ação',
        });
        return;
    }

    const schema = Joi.object({
        name: Joi.string().min(4).required(),
        email: Joi.string().email().required(),
        role: Joi.string().min(4).optional(),
        company: Joi.string().min(2).required(),
        techStack: Joi.array().items(Joi.string()).default([]),
        bio: Joi.string().optional().default('Sem relato disponível.'),
        story: Joi.string().optional().default('Sem relato disponível.'),
        birth: Joi.date().optional(),
        startDate: Joi.date().required(),
        endDate: Joi.date().optional(),
        social: Joi.object({
            linkedin: Joi.string().uri().optional(),
            github: Joi.string().uri().optional(),
            instagram: Joi.string().uri().optional(),
        }),
    });
    /*
        #swagger.tags = ['Estagiários']
        #swagger.summary = 'Cadastra um estagiário'

    */
    try {
        const {
            name,
            email,
            role,
            company,
            techStack,
            bio,
            story,
            birth,
            startDate,
            endDate,
            social,
        } = req.body;

        const { error, value } = schema.validate(req.body);

        const findEmail = await Estagiario.findOne({ email });
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

        const newEstagiario = new Estagiario(validated);
        await newEstagiario.save();

        res.status(201).json({
            message: `Estagiário ${name} cadastrado com sucesso`,
        });
        return;
    } catch (error) {
        res.status(500).json({ error });
    }
}
export async function getEstagiarios(
    req: Request,
    res: Response
): Promise<void> {
    // #swagger.tags = ['Estagiários']
    // #swagger.summary = 'Lista todos os estagiários'
    // #swagger.description = 'Retorna uma lista de todos os estagiários que foram cadastrados no sistema.'

    try {
        const estagiarios = await Estagiario.find();
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
    } catch (error) {
        res.status(500).json({ error });
    }
}

export async function updateEstagiario(req: Request, res: Response): Promise<void>{
    // #swagger.tags = ['Estagiarios']
    // #swagger.summary = 'Atualiza as informações de uma estagiario'
    const user = (req as IGetId).user;
    const internId = req.params.id;
    const updates = req.body; //pega todos os dados que serao atualizados

    try{
        if(user.role !== 'admin'){
            res.status(403).json({message: 'Acesso negado, precisa de um administrador'});
            return;
        }

        const updatedIntern = await Estagiario.findByIdAndUpdate(
            internId,
            updates, // Aplica todas as atualizações
            {new: true, runValidators: true} // Retorna o documento atualizado
        );

        if(!updatedIntern) {
            res.status(404).json({message: 'Esse estagiario nao foi encontrado'});
            return;
        }

        res.status(200).json({message: 'Perfil atualizado'});
    } catch (error){
        res.status(500).json({error: 'Erro interno'});
    }
}

export async function deleteEstagiario(req: Request, res: Response): Promise<void> {
    // #swagger.tags = ['Estagiarios']
    // #swagger.summary = 'Deleta o perfil de um estagiario'
    const user = (req as IGetId).user;
    const internId = req.params.id;

    try {
        if (user.role !== 'admin') {
            res.status(403).json({ message: 'Acesso negado. Apenas administradores podem executar esta ação.' });
            return;
        }

        const deletedIntern = await Estagiario.findByIdAndDelete(internId);

        if (!deletedIntern) {
            res.status(404).json({ message: 'Estagiário não encontrado' });
            return;
        }

        res.status(200).json({ message: `Perfil de ${deletedIntern.name} deletado com sucesso!` });
    } catch (error) {
        res.status(500).json({ error: 'Erro interno' });
    }
}
