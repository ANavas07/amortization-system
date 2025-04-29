import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { HandleMessages } from '../error/handleMessages.error';
import { Users } from '../models/users.models';
import { logoutUser } from '../controllers/auth.controllers';

const protectRoute = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const token = req.cookies.jwt;
        if (!token) {
            res.status(401).json({
                error: HandleMessages.UNAUTHORIZED
            });
            return;
        }

        let decoded;
        try {
            // Verificamos el token sin lanzar excepción si está expirado
            decoded = jwt.verify(token, process.env.JWT_SECRET as string);
        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                // Si el token ha expirado, cerramos la sesión y retornamos una respuesta de sesión expirada
                await logoutUser(req, res);
                res.status(401).json({
                    error: HandleMessages.SESSION_EXPIRED
                });
                return;
            } else {
                // Otro error de token (por ejemplo, firma inválida)
                res.status(401).json({
                    error: HandleMessages.INVALID_TOKEN
                });
                return;
            }
        }

        if (decoded && typeof decoded === 'object' && 'dni' in decoded) {
            const userInformation: Users = await Users.findByPk(decoded.dni, {
                attributes: { exclude: ['password'] }
            }) as Users;

            if (!userInformation) {
                res.status(404).json({
                    error: HandleMessages.USER_NOT_FOUND
                });
                return;
            }

            req.userReq = {
                dni: userInformation.dni
            };
            
            next();
        } else {
            res.status(500).json({
                error: HandleMessages.INTERNAL_SERVER_ERROR
            });
        }
    } catch (error) {
        console.log("Error en el middleware protectRoute: ", error);
        res.status(500).json({
            error: HandleMessages.INTERNAL_SERVER_ERROR
        });
    }
};

export default protectRoute;
