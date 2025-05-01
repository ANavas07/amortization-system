import { Request, Response } from 'express';
import { RequestBody } from 'swagger-jsdoc';
import { getConfigSystemService } from '../services/sysConfi.services';

export const getConfigSystem = async (req: Request, res: Response) => {
    try {
        const data = await getConfigSystemService();
        res.status(200).json({
            data
        });
    } catch (error) {
        res.status(500).json({
            error: "Error al obtener la configuracion del sistema"
        })
    }
};