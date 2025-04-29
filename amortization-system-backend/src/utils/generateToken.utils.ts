import jwt from 'jsonwebtoken';
import { Response } from 'express';

const generateTokenAndSetCookie =(dni:string, res:Response)=>{
    const token = jwt.sign({dni}, process.env.JWT_SECRET as string, {expiresIn: '5d'});
    res.cookie('jwt', token, {
        maxAge: 5*24*60*60*1000,
        httpOnly: true, //prevent XSS attacks
        sameSite: "none", //CSRF attacks cross-site request forgery attacks, if i use strict i need to use the same server
        secure: process.env.NODE_ENV === 'development' //cookie only works in https
    });
};

export default generateTokenAndSetCookie;