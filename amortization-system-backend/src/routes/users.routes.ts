import { Router } from "express";
import protectRoute from "../middleware/protectRoute.middleware";
import { getUsers, registerAndSendEmail, updateUser } from "../controllers/users.controllers";

const router = Router();
/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Gestión de usuarios
 */

/**
 * @swagger
 * /chaski/api/users/:
 *   get:
 *     summary: Obtener lista de usuarios
 *     description: Retorna una lista de usuarios asociados a la cooperativa del usuario autenticado.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: [] # Token JWT necesario
 *     responses:
 *       201:
 *         description: Lista de usuarios obtenida con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   dni:
 *                     type: string
 *                     description: DNI del usuario.
 *                   name:
 *                     type: string
 *                     description: Nombre del usuario.
 *                   last_name:
 *                     type: string
 *                     description: Apellido del usuario.
 *                   email:
 *                     type: string
 *                     description: Correo electrónico.
 *                   phone:
 *                     type: string
 *                     description: Teléfono del usuario.
 *                   role_id:
 *                     type: string
 *                     description: Rol del usuario.
 *       500:
 *         description: Error interno del servidor.
 */
router.get('/', protectRoute, getUsers);
router.put('/updateUser', protectRoute, updateUser);

/**
 * @swagger
 * /chaski/api/users/signUp:
 *   post:
 *     summary: Registrar un usuario y enviar correo
 *     description: Registra un nuevo usuario y envía un correo electrónico con la contraseña temporal.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: [] # Token JWT necesario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               dni:
 *                 type: string
 *                 description: DNI del usuario.
 *               name:
 *                 type: string
 *                 description: Nombre del usuario.
 *               last_name:
 *                 type: string
 *                 description: Apellido del usuario.
 *               user_name:
 *                 type: string
 *                 description: Nombre de usuario.
 *               email:
 *                 type: string
 *                 description: Correo electrónico.
 *               phone:
 *                 type: string
 *                 description: Teléfono del usuario.
 *               address:
 *                 type: string
 *                 description: Dirección del usuario.
 *               role_id:
 *                 type: string
 *                 description: Rol del usuario.
 *               cooperative_id:
 *                 type: string
 *                 description: ID de la cooperativa asociada.
 *     responses:
 *       201:
 *         description: Usuario registrado y correo enviado con éxito.
 *       500:
 *         description: Error interno del servidor.
 */
router.post('/signUp', protectRoute, registerAndSendEmail);
router.post('/signUp/admin', registerAndSendEmail);

export default router;