import { Model, DataTypes, InferAttributes, InferCreationAttributes } from "sequelize";
import connectionDb from "../db/connection.db";

export class Roles extends Model<
    InferAttributes<Roles>,
    InferCreationAttributes<Roles>
> {
    declare id: string;
    declare name: string;
    declare description: string;
}

Roles.init({
    id: {
        type: DataTypes.STRING(5),
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING(20),
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    }
}, {
    sequelize: connectionDb,
    tableName: 'Roles',
    timestamps: false
});

export default Roles;
