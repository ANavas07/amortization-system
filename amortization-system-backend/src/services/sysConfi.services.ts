import { isUtf8 } from 'buffer';
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

export const updateConfigSystemService = async (dataConfiguration:Record<string, any>) => {
    try {
        const text = await fs.promises.readFile(CONFIGPATH, 'utf-8');
        const updatedConfig = JSON.parse(text);
        const newConfig = { ...updatedConfig, ...dataConfiguration };
        await fs.promises.writeFile(CONFIGPATH, JSON.stringify(newConfig, null, 2), 'utf-8');
        return {
            status: 200,
            msg: 'Configuration updated successfully'
        };

    } catch (error) {
        return {
            status: 500,
            msg: error
        };
    }
}
