import {Request, Response} from 'express';
import { getBanksService, updateBankService } from '../services/bank.services';

export const getBanks = async (req: Request, res: Response) => {
    try {
        const data = await getBanksService();
        res.status(200).json({
            data: data
        });
        return;
    } catch (error) {
        res.status(500).json({
            error: "Error al obtener los bancos"
        })
    }
};

export const updateBank = async (req: Request, res: Response) => {
    try {
        const changes = req.body;
        const data = await updateBankService(changes);
        res.status(201).json({
            msg: data
        });
        return;
    } catch (error) {
        res.status(500).json({
            error: "Error al actualizar el banco"
        })
    }
}
