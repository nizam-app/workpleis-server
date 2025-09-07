
import jwt from 'jsonwebtoken';

export const generateToken =(payload,secret, expiresIn) =>{
     const token = jwt.sign(payload,secret,{expiresIn});
     return token;
}