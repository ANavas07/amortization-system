import Banks from "../models/Banks";
import { handleSequelizeError } from "../utils/helpers.utils";

export const getBanksService = async () => {
    try{
        const bank = await Banks.findAll();
        if(!bank){
            return {
                status: 404,
                msg: "No hay bancos registrados"
            }
        }
        return {
            status: 200,
            msg: bank
        }
    }catch(error){
        return handleSequelizeError(error);
    }
};

export const updateBankService = async (changes: Partial<Banks>) => {
    try{
        const bank = await Banks.findOne({
            where: {
                name: changes.name,
            }
        });
        if(!bank){
            return {msg: "No existe el banco"};
        }
        await bank.update(changes);
        return {msg: "Banco actualizado correctamente"};

    }catch(error){
        return handleSequelizeError(error);
    }
};