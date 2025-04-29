import { Model, DataTypes, InferAttributes, InferCreationAttributes } from "sequelize";
import connectionDb from "../db/connection.db";

// Definición del modelo usando `init()`
export class Users extends Model<
    InferAttributes<Users>,
    InferCreationAttributes<Users>
> {
    declare dni: string;
    declare name: string;
    declare lastName: string;
    declare userName: string;
    declare email: string;
    declare phone: string;
    declare password: string;
    declare address: string;
    declare roleID: string;
}

// Inicializar el modelo usando `init()`
Users.init({
    dni: {
        type: DataTypes.STRING(10),
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING(20),
        allowNull: false,
    },
    lastName: {
        type: DataTypes.STRING(20),
        allowNull: false,
    },
    userName: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true,
    },
    email: {
        type: DataTypes.STRING(50),
        allowNull: true,
    },
    phone: {
        type: DataTypes.STRING(14),
        allowNull: true,
    },
    password: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    address: {
        type: DataTypes.STRING(80),
        allowNull: true,
    },
    roleID: {
        type: DataTypes.STRING(5),
        allowNull: false,
    },
}, {
    sequelize: connectionDb,  // Conexión a la base de datos
    tableName: 'Users',       // Nombre de la tabla en la base de datos
});
