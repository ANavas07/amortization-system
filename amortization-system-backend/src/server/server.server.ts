// import { UserLoginT } from './../types/index.types';
import express, {Request, Response, NextFunction} from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from '../routes/auth.routes';
import usersRoute from '../routes/users.routes';

//Documentacion de la API
import swaggerUi from 'swagger-ui-express';


import {
    Roles,
    Users,
    Admin,

} from '../models/tableAssociations.models';
import openapiSpecification from '../swaggerDocumentation/swagger.swaggerDocumentation';

export default class Server {
    private app: express.Application;
    private port: string;

    constructor() {
        this.app = express();
        this.port = process.env.PORT || '3001';
        this.listen();
        this.middlewares();
        this.routes();
    };
    
    listen() {
        this.app.listen(parseInt(this.port), '0.0.0.0', () => {
            this.dbConnect();
            console.log('Server running on port ' + this.port);
        })
    };

    routes() {
        const prefixUrl = '/devChickenBros'
        this.app.use(`${prefixUrl}/auth`, authRoutes);
        this.app.use(`${prefixUrl}/users`, usersRoute);

        //Ruta para la documentación de la API
        this.app.use(`${prefixUrl}/docs`, swaggerUi.serve, swaggerUi.setup(openapiSpecification)); 
    };

    middlewares() {
        this.app.use(express.json({limit: "50mb"}));
        this.app.use(cookieParser());//analize the cookies in the request and parse them to a js object (req.cookies)
        this.app.use(cors({
            credentials: true,
            origin: true,
            allowedHeaders: ["Content-Type"],
            methods: ["GET", "POST", "PUT", "DELETE"],  // Agrega aquí los métodos permitidos
            
        }));
        this.app.disable('x-powered-by');
        this.app.use(this.securityHeaders);
    };

    securityHeaders(req: Request, res: Response, next: NextFunction) {
        res.setHeader("Content-Security-Policy", "default-src 'self'; script-src 'self' https://apis.google.com; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://api.example.com; frame-src 'none'; object-src 'none'");
        res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
        res.setHeader("X-Content-Type-Options", "nosniff");
        res.setHeader("X-Frame-Options", "DENY");
        res.setHeader("X-XSS-Protection", "1; mode=block");
        res.setHeader("Referrer-Policy", "no-referrer");
        res.setHeader("Permissions-Policy", "geolocation=(self), microphone=()");
        next();
    };

    /*@dbConnect: Asynchronous function that creates the database based on
    sequelize rules*/
    async dbConnect() {
        try {
                // { alter: true } is used to update the database schema
                await Admin.sync(),
                await Roles.sync(),      
                await Users.sync(),               
            console.log("Database connected successfully");
        } catch (error) {
            console.log("Unable to connect to the db: " + error);
        }
    };
}