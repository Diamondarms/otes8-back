import { Request, Response } from 'express';
import createApp from '../src/app';

let appPromise: Promise<any> | null = null;

export default async function handler(req: Request, res: Response) {
    console.log("[DEBUG] Nova requisição recebida:", req.method, req.url);

    // 1. Responde o CORS imediatamente
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, x-user-id, Authorization');

    if (req.method === 'OPTIONS') {
        console.log("[DEBUG] Respondendo OPTIONS imediatamente");
        res.status(200).end();
        return;
    }

    if (!appPromise) {
        console.log("[DEBUG] Inicializando aplicação (createApp)...");
        appPromise = createApp();
    }

    try {
        console.log("[DEBUG] Aguardando appPromise...");
        const app = await appPromise;
        console.log("[DEBUG] App carregado, passando requisição para o Express...");
        app(req, res);
    } catch (error) {
        console.error("[ERRO FATAL] Erro ao carregar a aplicação:", error);
        res.status(500).json({ error: "Erro interno ao iniciar a aplicação", details: String(error) });
    }
}