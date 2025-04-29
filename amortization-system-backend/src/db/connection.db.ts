import { Sequelize } from "sequelize";

class ConnectionDB{
    private static instance: Sequelize | null;
    
    private constructor(){}

    public static getInstance(){
        if(!ConnectionDB.instance){
            ConnectionDB.instance = new Sequelize(
                process.env.DB_NAME || '',
                process.env.DB_USER || '',
                process.env.DB_PASSWORD || '',
                {
                    host: process.env.DB_HOST,
                    dialect: "mysql",
                    pool:{
                        max:20,
                        min:0,
                        acquire:30000, //max time to wait for a connection
                        idle:10000 //max time the connection can be idle
                    }
                });
        }
        return ConnectionDB.instance;
    }

}   

export default ConnectionDB.getInstance();