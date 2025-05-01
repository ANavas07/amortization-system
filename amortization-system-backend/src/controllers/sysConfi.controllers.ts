import { Request, Response } from 'express';
import { RequestBody } from 'swagger-jsdoc';
import { getConfigSystemService, updateConfigSystemService } from '../services/sysConfi.services';

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

export const updateConfigSystem = async (req: Request, res: Response) => {
    try {
        const changes = req.body as Partial<Record<string, number>>;
        const validKeys = [
            "consumo",
            "vehicular",
            "hipotecario",
            "microcredito",
            "quirografario",
        ];

        for (const key of Object.keys(changes)) {
            if (!validKeys.includes(key)) {
                res.status(400).json({
                    status: 400,
                    msg: `La clave ${key} no es valida`
                });
                return;
            };
        }
        const data = await updateConfigSystemService(changes);
        res.status(200).json({
            status: 200,
            msg: data.msg
        });
        return;
    } catch (error) {
        res.status(500).json({
            status: 500,
            msg: "Error al actualizar la configuracion del sistema"
        });
        return;
    }
}