import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import env from '../common/config/env.config';

export class JwtAuthenticationMiddleware {
  validateJwt(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    const authParts = authHeader?.split(' ');

    if (authParts?.length !== 2) {
      res.status(401).json({
        message: 'No authorization token was found',
      });
      return;
    }

    const [type, credential] = authParts;
    if (type !== 'Bearer') {
      res.status(401).json({
        message: 'Bad format of authorization',
      });
      return;
    }
    try {
      res.locals.jwt = jwt.verify(credential, env.jwt.accessSecretKey);
      return next();
    } catch (error) {
      res.status(403).json({
        message: 'Access denied',
      });
    }
  }
}
