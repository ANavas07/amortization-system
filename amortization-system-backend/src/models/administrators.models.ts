import { Model, DataTypes, InferAttributes, InferCreationAttributes } from "sequelize";
import connectionDb from "../db/connection.db";

// Definición del modelo de Administrador
export class Admin extends Model<
    InferAttributes<Admin>,
    InferCreationAttributes<Admin>
> {
    declare dni: string;
    declare userName: string;
    declare email: string;
    declare password: string;
    declare roleID: string;
}

// Inicializar el modelo Admin con el rol predeterminado "superAdmin"
Admin.init({
    dni: {
        type: DataTypes.STRING(10),
        primaryKey: true,
    },
    userName: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true,
    },
    email: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    password: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    roleID: {
        type: DataTypes.STRING(10),
        allowNull: false,
        defaultValue: 'superAdmin',
    }
}, {
    sequelize: connectionDb,
    tableName: 'Admins',
});
