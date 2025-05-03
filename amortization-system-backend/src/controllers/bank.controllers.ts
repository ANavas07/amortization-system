import {Request, Response} from 'express';
import { getBanksService, updateBankService } from '../services/bank.services';
import { uploadAndReplaceToHostinger } from '../utils/uploadImagesFtp';
import path from 'path';
import { BanksT } from '../types/index.types';

export const getBanks = async (req: Request, res: Response) => {
    try {
        const data = await getBanksService();
        res.status(200).json({
            msg: data
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
        const bankData:BanksT={
            name: changes.name,
            logo: remoteFileName ? remoteFileName : changes.logo,
            address: changes.address,
            phone: changes.phone,
            email: changes.email,
            slogan: changes.slogan,
        }
        ;

        await updateBankService(bankData);
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
