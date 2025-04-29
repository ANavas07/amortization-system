import {Request} from 'express';

//extend express request interface to use userReq property
interface UserRequest{
    dni:string;
}

declare module 'express-serve-static-core'{
    interface Request{
        userReq?:UserRequest;
    }
}