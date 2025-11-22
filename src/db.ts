import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL || "";
const isProduction = process.env.NODE_ENV === 'production';

// --- DEBUG: MOSTRA A URL NO LOG (MASCARANDO A SENHA) ---
if (!connectionString) {
    console.error(">>> [CRITICAL] DATABASE_URL está VAZIA/UNDEFINED");
} else {
    // Esconde a senha para não vazar no log, mas mostra o resto
    const masked = connectionString.replace(/:([^:@]+)@/, ":****@");
    console.log(">>> [DEBUG URL] A Vercel está lendo isto:", masked);
}
// -------------------------------------------------------

export const client = new Pool({
    connectionString: connectionString,
    ssl: isProduction ? { rejectUnauthorized: false } : false,
    max: 1,
    connectionTimeoutMillis: 5000, 
    idleTimeoutMillis: 10000,      
});

export const query = async (text: string, params?: any[]) => {
    if (!connectionString) throw new Error("DATABASE_URL missing");

    try {
        return await client.query(text, params);
    } catch (error: any) {
        console.error("DB Error:", error.message);
        if (error.code) console.error("Code:", error.code);
        throw error;
    }
};