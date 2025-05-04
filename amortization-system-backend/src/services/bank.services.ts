import Banks from "../models/Banks";
import { handleSequelizeError } from "../utils/helpers.utils";

export const getBanksService = async () => {
    try {
        const bank = await Banks.findAll();
        if (!bank) {

            return "No hay bancos registrados";
        }
        return bank
    } catch (error) {
        return handleSequelizeError(error);
    }
};

export const updateBankService = async (changes: Partial<Banks>) => {
    try {
        const bank = await Banks.findOne({});

        if (!bank) {
            return { msg: "No existe el banco" };
        };

        console.log(
            changes.name,
            changes.address,
            changes.phone,
            changes.email,
            changes.logo,
            changes.slogan
        );

        await bank.update(
            {
                name: changes.name,
                address: changes.address,
                phone: changes.phone,
                email: changes.email,
                logo: changes.logo,
                slogan: changes.slogan
            }
        );
        return;
    } catch (error) {
        return handleSequelizeError(error);
    }
};