import { Request, Response } from "express"
import { handleSequelizeError } from "../utils/helpers.utils"
import { HandleMessages } from "../error/handleMessages.error"
import { createUserService, getUsersService, updateUserService } from "../services/users.services"
import { UserT } from "../types/index.types";
import { sendEmail } from "../services/mail.services";

export const getUsers = async (req: Request, res: Response) => {
    try {
        const { dni } = req.userReq as { dni: string }
        const result = await getUsersService(dni);
        res.status(result.status).json(result.json);
        return;
    } catch (error) {
        res.status(500).json({ msg: HandleMessages.INTERNAL_SERVER_ERROR })
        return;
    }
};

export const registerAndSendEmail = async (req: Request, res: Response) => {
    try {
        const { dni, name, lastName, userName, email, phone, address, roleID } = req.body;
        const auxPassword = randomPassowordGenerator();
        const userData: UserT = {
            dni, name, lastName,
            userName, email, phone,
            password: auxPassword, address, roleID
        };

        const emptyFields: String[] = [];
        for (const [key, value] of Object.entries(userData) as [keyof UserT, any][]) {
            if (value === undefined || value === "") {
                emptyFields.push(key);
            }
        };

        if (emptyFields.length > 0) {
            res.status(400).json({ msg: HandleMessages.INVALID_USER_DATA, emptyFields });
            return;
        } else {
            const result = await createUserService(userData);
            if (result.status !== 201) {
                res.status(result.status).json({ msg: result.json });
                return;
            }
            // Enviar el correo si el usuario se creó
            const emailSent = await sendEmail(email, generateMailMessage(auxPassword, name));
            if (!emailSent.success) {
                console.error('Error al enviar el correo:', emailSent.error);
                res.status(500).json({ msg: HandleMessages.EMAIL_NOT_SENT });
                return;
            }else{
                res.status(result.status).json(result.json);
            }
            return;
        };
    } catch (error) {
        res.status(500).json({ msg: HandleMessages.INTERNAL_SERVER_ERROR, error: error });
        return;
    }
};

export const updateUser = async (req: Request, res: Response) => {
    const { dni, name, lastName, userName, phone, address, password } = req.body;
    const result = await updateUserService({ dni, name, lastName, userName, phone, address, password });
    if (result.status !== 201) {
        res.status(result.status).json(result.json);
        return;
    }
    res.status(result.status).json(result.json);
    return;
};

const randomPassowordGenerator = () => {
    return Math.random().toString(36).slice(-8);
};

const generateMailMessage = (password: string, userName: string) => {
    const html: string = `
            <h1>Bienvenido a DevChickenBros</h1>
            <p>Hola <strong>${userName}</strong>,</p>
            <p>Gracias por ser parte de nuestra comunidad. Aquí tienes tu contraseña temporal:</p>
            <p style="font-size: 18px; font-weight: bold;">${password}</p>
            <p>Por favor, cámbiala después de iniciar sesión.</p>
            <p>Saludos,<br/>El equipo de DevChickenBros</p>
        `
    return html;
}
