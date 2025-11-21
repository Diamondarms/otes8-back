import { Request, Response } from 'express';
import * as repo from './repositories';
import { RecordTypeEnum, CategoryEnum } from './models';

const enforceDayOne = (dateString: string): string => {

    const date = new Date(dateString);
    date.setDate(1);

    return date.toISOString().split('T')[0];
};

// --- USER CONTROLLER ---

export const loginUser = async (req: Request, res: Response) => {
    try {
        const { name } = req.body; 

        if (!name) {
            return res.status(400).json({ error: "Nome é obrigatório" });
        }

        let user = await repo.findUserByName(name);

        if (!user) {
            user = await repo.createUser(name);
        }

        return res.json(user);
    } catch (error) {
        return res.status(500).json({ error: "Erro ao processar usuário" });
    }
};

export const getUserByName = async (req: Request, res: Response) => {
    try {
        const { name } = req.params;
        const user = await repo.findUserByName(name);
        if (!user) return res.status(404).json({ error: "Usuário não encontrado" });
        return res.json(user);
    } catch (error) {
        return res.status(500).json({ error: "Erro ao buscar usuário" });
    }
};

// --- REGISTROS CONTROLLER ---

export const getRegistros = async (req: Request, res: Response) => {
    try {
        const { date } = req.params;
        
        const userId = Number(req.headers['x-user-id']);

        if (!userId) return res.status(400).json({ error: "ID do usuário necessário no header 'x-user-id'" });
        
        const registros = await repo.findRegistrosByDate(date, userId);
        return res.json(registros);
    } catch (error) {
        return res.status(500).json({ error: "Erro ao buscar registros" });
    }
};

export const createEntrada = async (req: Request, res: Response) => {
    try {
        const { date, value, name, user_id } = req.body;
    
        const newRegistro = await repo.createRegistro({
            date,
            value,
            name,
            user_id,
            record_type: RecordTypeEnum.entrada,
            category: undefined, 
            due_date: undefined  
        });
        
        return res.json(newRegistro);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Erro ao criar entrada" });
    }
};

export const createGastoFixo = async (req: Request, res: Response) => {
    try {
        const { date, value, name, due_date, user_id } = req.body;

        const fixedDate = enforceDayOne(date);
        const fixedDueDate = due_date ? enforceDayOne(due_date) : undefined;

        const newRegistro = await repo.createRegistro({
            date: fixedDate,
            value,
            name,
            user_id,
            record_type: RecordTypeEnum.gasto_fixo,
            category: undefined,
            due_date: fixedDueDate
        });

        return res.json(newRegistro);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Erro ao criar gasto fixo" });
    }
};

export const createGastoVariavel = async (req: Request, res: Response) => {
    try {
        const { date, value, name, category, user_id } = req.body;

        const newRegistro = await repo.createRegistro({
            date,
            value,
            name,
            user_id,
            record_type: RecordTypeEnum.gasto_variavel,
            category: category as CategoryEnum,
            due_date: undefined
        });

        return res.json(newRegistro);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Erro ao criar gasto variável" });
    }
};

export const updateGastoFixo = async (req: Request, res: Response) => {
    try {
        const { id, date, value, name, due_date } = req.body;

        const fixedDate = enforceDayOne(date);
        const fixedDueDate = due_date ? enforceDayOne(due_date) : "";

        const updated = await repo.updateGastoFixo(id, fixedDate, value, name, fixedDueDate);
        return res.json(updated);
    } catch (error) {
        return res.status(500).json({ error: "Erro ao atualizar gasto fixo" });
    }
};

export const deleteRegistro = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await repo.deleteRegistro(Number(id));
        return res.status(204).send();
    } catch (error) {
        return res.status(500).json({ error: "Erro ao deletar registro" });
    }
};

// --- META CONTROLLER ---

export const getMeta = async (req: Request, res: Response) => {
    try {
        const { date } = req.params;
        const userId = Number(req.headers['x-user-id']);

        if (!userId) return res.status(400).json({ error: "ID do usuário necessário" });

        const meta = await repo.findMetaByDate(date, userId);

        return res.json(meta || {}); 
    } catch (error) {
        return res.status(500).json({ error: "Erro ao buscar meta" });
    }
};

export const createMeta = async (req: Request, res: Response) => {
    try {
        const { value, date, user_id } = req.body;
        const novaMeta = await repo.createMeta(value, date, user_id);
        return res.json(novaMeta);
    } catch (error) {
        return res.status(500).json({ error: "Erro ao criar meta" });
    }
};

export const updateMeta = async (req: Request, res: Response) => {
    try {
        const { id, value } = req.body;
        
        const updated = await repo.updateMeta(id, value);
        return res.json(updated);
    } catch (error) {
        return res.status(500).json({ error: "Erro ao atualizar meta" });
    }
};