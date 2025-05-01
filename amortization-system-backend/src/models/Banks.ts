import { Model, DataTypes, InferAttributes, InferCreationAttributes, Sequelize } from "sequelize";
import connectionDb from "../db/connection.db";

export class Banks extends Model<
    InferAttributes<Banks>,
    InferCreationAttributes<Banks>
> {
    declare name: string;
    declare address: string;
    declare phone: string;
    declare email: string;
    declare logo: string;
    declare slogan: string;
}

Banks.init({
    name: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    address: {
        type: DataTypes.STRING(80),
        allowNull: false,
    },
    phone: {
        type: DataTypes.STRING(14),
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    logo: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    slogan: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    
}, {
    sequelize: connectionDb,
    tableName: 'Banks',
    timestamps: false
});

export default Banks;
