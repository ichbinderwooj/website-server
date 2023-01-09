import { NextFunction, Request, Response } from 'express';
import { JwtPayload, verify } from 'jsonwebtoken';
import { User } from '../entity/user';
import { UserRequest } from '../interfaces/user-request';
import { jwt } from '../../config.json';

export async function authenticate(
  req: UserRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers['authorization'];
  if (authHeader) {
    const token = authHeader.split(' ')[1];

    try {
      var jwtData = verify(token, jwt.accessTokenSecret) as JwtPayload;
      req.user = { id: jwtData.id, permission: jwtData.permission };
    } catch (err) {
      // catch
    }
  }

  next();
}
