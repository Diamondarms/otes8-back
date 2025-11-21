import { Request, Response } from 'express';
import createApp from '../src/app';

let appPromise: Promise<any> | null = null;

export default async function handler(req: Request, res: Response) {
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (!appPromise) {
        appPromise = createApp();
    }
    
    const app = await appPromise;
    
    app(req, res);
}