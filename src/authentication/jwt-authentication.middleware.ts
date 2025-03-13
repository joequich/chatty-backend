import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import env from '../env.config';

export class JwtAuthenticationMiddleware {
  validateJwt(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    const authParts = authHeader?.split(' ');

    if (authParts && authParts.length === 2) {
      const [type, credential] = authParts;

      if (!type?.startsWith('Bearer')) {
        res.status(401).json({
          message: 'Bad format of authorization',
        });
      }

      try {
        res.locals.jwt = jwt.verify(credential, env.jwt.accessSecretKey);
        return next();
      } catch (error) {
        res.status(403).json({
          message: 'Access denied',
        });
      }
    } else {
      res.status(401).json({
        message: 'No authorization token was found',
      });
    }
  }
}
