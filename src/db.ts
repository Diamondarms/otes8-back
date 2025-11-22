import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL || "";
const isProduction = process.env.NODE_ENV === 'production';

export const client = new Pool({
    connectionString: connectionString,
    ssl: isProduction ? { rejectUnauthorized: false } : false,
    max: 1,
    connectionTimeoutMillis: 5000, 
    idleTimeoutMillis: 10000,      
});

export const query = async (text: string, params?: any[]) => {
    if (!connectionString) {
        console.error("DATABASE_URL missing");
        throw new Error("DATABASE_URL missing");
    }

    try {
        const res = await client.query(text, params);
        return res;
    } catch (error: any) {
        console.error("DB Error:", error.message);
        if (error.code) console.error("Code:", error.code);
        throw error;
    }
};