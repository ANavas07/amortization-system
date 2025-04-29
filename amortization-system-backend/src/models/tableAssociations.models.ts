
import { Users } from "./users.models";
import { Admin } from "./administrators.models";
import Roles from "./roles.models";


Roles.hasMany(Users, {foreignKey: 'roleID', sourceKey: 'id'});
Users.belongsTo(Roles, {foreignKey: 'roleID', targetKey: 'id'});

export{
    Users,    
    Admin,
    Roles
};