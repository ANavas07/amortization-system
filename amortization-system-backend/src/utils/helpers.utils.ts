
import { ValidationError, UniqueConstraintError, DatabaseError } from 'sequelize';
import { HandleMessages } from '../error/handleMessages.error';

// Función para obtener datos de paginación
export const getPaginationData = (query: any, pattern?: string) => {
    const { page = 1, limit = 10 } = query;
    const paginationData: any = {
        page: page as number,
        limit: limit as number
    };
    if (pattern) {
        paginationData.pattern = pattern;
    }
    return paginationData;
};

//Manejo de errores específicos de Sequelize
export const handleSequelizeError = (error: any) => {

    if (error instanceof UniqueConstraintError) {
        return { status: 400, json: { error: HandleMessages.DEFAULT_INSTANCE_EXIST } };
    }

    if (error instanceof ValidationError) {
        return {
            status: 400,
            json: { error: 'Validation error: ' + error.errors.map((e: any) => e.message).join(', ') }
        };
    }

    if (error instanceof DatabaseError) {
        return { status: 500, json: { error: HandleMessages.DATABASE_ERROR } };
    }

    // Si el error no es uno de los anteriores, devolver un error genérico
    return { status: 500, json: { error: HandleMessages.UNEXPECTED_ERROR } };
};
