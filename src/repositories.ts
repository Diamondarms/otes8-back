import { client } from "./db";
import { RegistroModel, MetaModel, UserModel, CategoryEnum, RecordTypeEnum } from "./models";

// --- USER REPOSITORY ---

export const findUserByName = async (name: string): Promise<UserModel | null> => {
    console.log("[DEBUG] Repository: findUserByName - Preparando query...");
    const query = "SELECT * FROM users WHERE username = $1";
    const values = [name];
    
    try {
        console.log("[DEBUG] Repository: Executando db.query...");
        // Aqui é onde costuma travar se o banco não responder
        const result = await client.query(query, values); 
        console.log("[DEBUG] Repository: Query retornou. Linhas:", result.rows.length);

        if (result.rows.length > 0) {
            return result.rows[0];
        }
        return null;
    } catch (err) {
        console.error("[ERRO FATAL] Repository findUserByName:", err);
        throw err;
    }
};

export const createUser = async (name: string): Promise<UserModel> => {
    const query = "INSERT INTO users (username) VALUES ($1) RETURNING *";
    const values = [name];
    
    const result = await client.query(query, values);
    return result.rows[0];
};

// --- REGISTROS REPOSITORY ---

export const findRegistrosByDate = async (date: string, userId: number): Promise<RegistroModel[]> => {
    const [year, month] = date.split('-');
    const yearMonth = `${year}-${month}`;

    const query = `
        SELECT * FROM registros 
        WHERE id_user = $2
        AND (
            (record_type IN ('0', '2') 
             AND to_char(date, 'YYYY-MM') = $1)
            
            OR 
            
            (record_type = '1'
             AND to_char(date, 'YYYY-MM') <= $1 
             AND (due_date IS NULL OR to_char(due_date, 'YYYY-MM') >= $1)
            )
        )
    `;
    
    const values = [yearMonth, userId];

    const result = await client.query(query, values);
    return result.rows;
};

export const createRegistro = async (registro: Omit<RegistroModel, 'id'>): Promise<RegistroModel> => {
    const query = `
        INSERT INTO registros (date, value, name, record_type, category, due_date, id_user)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
    `;
    const values = [
        registro.date,
        registro.value,
        registro.name,
        registro.record_type,
        registro.category,
        registro.due_date,
        registro.user_id
    ];

    const result = await client.query(query, values);
    return result.rows[0];
};

export const updateGastoFixo = async (id: number, date: string, value: number, name: string, due_date: string): Promise<RegistroModel> => {
    const query = `
        UPDATE registros 
        SET date = $1, value = $2, name = $3, due_date = $4
        WHERE id = $5 AND record_type = ${RecordTypeEnum.gasto_fixo}
        RETURNING *
    `;
    const values = [date, value, name, due_date, id];
    
    const result = await client.query(query, values);
    return result.rows[0];
};

export const deleteRegistro = async (id: number): Promise<void> => {
    const query = "DELETE FROM registros WHERE id = $1";
    await client.query(query, [id]);
};

// --- META REPOSITORY ---

export const findMetaByDate = async (date: string, userId: number): Promise<MetaModel | null> => {
    const query = "SELECT * FROM meta WHERE date = $1 AND id_user = $2";
    const values = [date, userId];
    
    const result = await client.query(query, values);
    
    if (result.rows.length > 0) {
        return result.rows[0];
    }
    return null;
};

export const createMeta = async (value: number, date: string, userId: number): Promise<MetaModel> => {
    const query = "INSERT INTO meta (value, date, id_user) VALUES ($1, $2, $3) RETURNING *";
    const values = [value, date, userId];
    
    const result = await client.query(query, values);
    return result.rows[0];
};

export const updateMeta = async (id: number, value: number): Promise<MetaModel> => {
    const query = "UPDATE meta SET value = $1 WHERE id = $2 RETURNING *";
    const values = [value, id];
    
    const result = await client.query(query, values);
    return result.rows[0];
};