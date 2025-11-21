import { Client } from 'pg';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    throw new Error('A variável de ambiente DATABASE_URL não está configurada.');
}

const isProduction = process.env.NODE_ENV === 'production';

export const client = new Client({
    connectionString: connectionString,
    ssl: isProduction ? { rejectUnauthorized: false } : false
});

async function dbConnect() {
    try {
        // @ts-ignore
        if (!client._connected) { 
            await client.connect();
            console.log("Conexão com o banco de dados foi estabelecida com sucesso!");
        }
    } catch (err) {
        console.error("Erro na conexão com o Banco:", err);
    }
}

export default dbConnect;