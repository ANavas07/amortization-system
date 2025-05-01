import fs from 'fs';
import path from 'path';

const CONFIGPATH = './src/utils/configSystemAmortization.json';

export const getConfigSystemService = async () => {
    try {
        const data = await fs.promises.readFile(CONFIGPATH, 'utf-8');
        const config = JSON.parse(data);
        return config;
    } catch (error) {
        return {
            status: 500,
            msg: error
        };
    }
}

export const updateConfigSystemService = async (data: any) => {
    try{
        

    }catch (error) {
        return {
            status: 500,
            msg: error
        };
    }
}
