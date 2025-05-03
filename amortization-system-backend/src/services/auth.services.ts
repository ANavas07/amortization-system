import bcrypt from "bcrypt";
import { Users } from "../models/users.models";
import { Op } from "sequelize";
import generateTokenAndSetCookie from "../utils/generateToken.utils";
import { HandleMessages } from "../error/handleMessages.error";
import { Response } from "express";
import { SaasAdminLoginT, UserLoginT } from "../types/index.types";
import { handleSequelizeError } from "../utils/helpers.utils";
import { Admin } from "../models/administrators.models";
import Banks from "../models/Banks";

// Servicio para iniciar sesión
export const loginUserService = async (
    { userName,
        email,
        password }: UserLoginT,
    res: Response
) => {
    try {
        const user = await Users.findOne({
            where: {
                [Op.or]: [{ userName }, { email }]
            }
        }) as Users;

        if (!user || !(await bcrypt.compare(password, user?.password || ""))) {
            return {
                status: 404,
                json: { error: HandleMessages.INVALID_CREDENTIALS }
            };
        }

        const logoRoute = await Banks.findOne({
            attributes: ["logo"],
        })
        // Generar token y establecer cookie
        generateTokenAndSetCookie(user.dni, res);

        return {
            status: 200,
            json: {
                fullName: user.name + " " + user.lastName,
                dni: user.dni,
                role: user.roleID,
                logo: logoRoute?.logo,
            }
        };
    } catch (error) {
        return handleSequelizeError(error);
    }
};

//Servicio ingreso superAdmin
export const loginSuperAdminService = async (
    { userName, email, password }: SaasAdminLoginT,
    res: Response
) => {
    try {
        const admin = await Admin.findOne({
            where: {
                [Op.or]: [{ userName }, { email }]
            }
        }) as Admin;
        if (!admin || !(await bcrypt.compare(password, admin?.password || ""))) {
            return {
                status: 404,
                json: { error: HandleMessages.INVALID_CREDENTIALS }
            };
        }
        // Generar token y establecer cookie
        generateTokenAndSetCookie(admin.dni, res);

        return {
            status: 200,
            json: {
                userName: admin.userName,
                dni: admin.dni,
                email: admin.email,
                role: admin.roleID
            }
        };
    } catch (error) {
        return handleSequelizeError(error);
    }
};

// Servicio para cerrar sesión
export const logoutUserService = async (res: Response) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        return {
            status: 200,
            json: { message: HandleMessages.SUCCESSFULLY_LOGGED_OUT }
        };
    } catch (error) {
        return handleSequelizeError(error);
    }
};
