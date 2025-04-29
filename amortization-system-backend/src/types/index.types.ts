import { InferAttributes } from "sequelize";
import { Users } from "../models/users.models";
import { Admin } from "../models/administrators.models";

export type ValidateRoleAndRouteId = {
    dni: string,
    cooperative_id: string,
    departure_station_id: number,
    arrival_station_id: number
}


export type UserLoginT = Pick<Users, 'userName' | 'email' | 'password'>;

export type UserT = InferAttributes<Users>;

export type UpdateUserT = Pick<Users, 'dni' | 'name' | 'lastName' | 'userName' | 'phone' | 'address' | 'password'>;


export type SaasAdminLoginT=Pick<Admin,  'userName' | 'email' | 'password' >;

export type DataPaginationT = {
    page: number,
    limit: number,
    pattern?: string
};