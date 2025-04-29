import { Client } from 'basic-ftp';

export async function uploadToHostinger(buffer: Buffer, remoteFileName: string) {
    const client = new Client();
    client.ftp.verbose = false; //true para ver logs

    try {
        await client.access({
            host: process.env.FTP_IP,      // Cambia con tu host FTP
            user: process.env.FTP_USERNAME,              // Usuario FTP
            password: process.env.FTP_PASSWORD,          // Contraseña FTP
            secure: false
        });

        // Sube el contenido del buffer directamente al FTP
        const { Readable } = require('stream');
        const readableStream = new Readable();
        readableStream.push(buffer);
        readableStream.push(null);
        await client.uploadFrom(readableStream, remoteFileName);
    } catch (error) {
        console.error("Error al subir al FTP:", error);
    } finally {
        client.close();
    }
};

export async function deleteFromHostinger(remoteFileName: string) {
    const client = new Client();
    client.ftp.verbose = false; // true para ver logs detallados

    try {
        await client.access({
            host: process.env.FTP_IP,      // Cambia con tu host FTP
            user: process.env.FTP_USERNAME, // Usuario FTP
            password: process.env.FTP_PASSWORD, // Contraseña FTP
            secure: false
        });

        // Elimina el archivo del servidor FTP
        await client.remove(remoteFileName);
        console.log(`Archivo eliminado: ${remoteFileName}`);
    } catch (error) {
        console.error("Error al eliminar el archivo en el FTP:", error);
    } finally {
        client.close();
    }
};

export async function uploadAndReplaceToHostinger(
    buffer: Buffer,
    newFileName: string,
    oldFileName?: string
) {
    const client = new Client();
    client.ftp.verbose = false; // true para logs detallados

    try {
        await client.access({
            host: process.env.FTP_IP,      // Cambia con tu host FTP
            user: process.env.FTP_USERNAME, // Usuario FTP
            password: process.env.FTP_PASSWORD, // Contraseña FTP
            secure: false
        });

        // Si hay un archivo antiguo, elimínalo
        if (oldFileName) {
            try {
                await client.remove(oldFileName);
                console.log(`Archivo anterior eliminado: ${oldFileName}`);
            } catch (error) {
                console.log(`No se pudo eliminar el archivo anterior (${oldFileName}):`, error);
            }
        }

        // Sube el archivo nuevo
        const { Readable } = require("stream");
        const readableStream = new Readable();
        readableStream.push(buffer);
        readableStream.push(null);
        await client.uploadFrom(readableStream, newFileName);
        console.log(`Archivo subido: ${newFileName}`);
    } catch (error) {
        console.error("Error al subir o reemplazar archivo en el FTP:", error);
    } finally {
        client.close();
    }
}
