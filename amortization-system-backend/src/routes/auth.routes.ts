import { Router } from "express";
import {loginAdmin, loginUser, logoutUser} from "../controllers/auth.controllers";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Endpoints relacionados con autenticación
 */

/**
 * @swagger
 * /chaski/api/auth/login:
 *   post:
 *     summary: Iniciar sesión en el sistema
 *     description: Permite a los usuarios iniciar sesión proporcionando credenciales válidas.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: Nombre de usuario del cliente.
 *                 example: johndoe
 *               email:
 *                 type: string
 *                 description: correo electronico usuario.
 *                 example: johndoe@gmail.com
 *               password:
 *                 type: string
 *                 description: Contraseña del cliente.
 *                 example: securePassword123
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 full_name:
 *                   type: string
 *                   description: Nombre completo del usuario.
 *                   example: JohnDoes
 *                 dni:
 *                   type: string
 *                   description: Documento Nacional de Identidad del usuario.
 *                   example: 18048325656
 *                 cooperative:
 *                   type: string
 *                   description: Cooperativa a la que pertenece el usuario.
 *                   example: Jerpa
 *                 role:
 *                   type: string
 *                   description: Rol del usuario en el sistema.
 *                   example: admin
 *                 logo:
 *                   type: string
 *                   description: Logo de la cooperativa del usuario.
 *                   example: 1735180563219-572916840.png
 *       400:
 *         description: Credenciales inválidas.
 *       500:
 *         description: Error del servidor.
 */

router.post('/login', loginUser);
router.post('/loginadmin', loginAdmin);
/**
 * @swagger
 * /chaski/api/auth/logout:
 *   get:
 *     summary: Cerrar sesión
 *     description: Elimina la cookie con el token JWT y cierra la sesión del usuario.
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Sesión cerrada correctamente.
 *       401:
 *         description: El usuario no está autenticado.
 *       500:
 *         description: Error del servidor.
 */
router.get('/logout', logoutUser);

export default router;