import {Request, Response} from 'express';
import { getBanksService, updateBankService } from '../services/bank.services';
import { uploadAndReplaceToHostinger } from '../utils/uploadImagesFtp';
import path from 'path';

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
        let remoteFileName = '';
        if(req.file){
            remoteFileName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(req.file.originalname)}`;
            await uploadAndReplaceToHostinger(req.file.buffer, remoteFileName, changes.logo);
        };
        const data = await updateBankService(changes);
        res.status(200).json({
            msg: "Banco actualizado correctamente",
        });
        return;
    } catch (error) {
        res.status(500).json({
            error: "Error al actualizar el banco"
        })
    }
}
