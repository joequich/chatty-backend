import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import env from '../common/config/env.config';
import type { UserService } from '../user/user.service';

export class JwtRefreshAuthenticationMiddleware {
  constructor(private readonly userService: UserService) {}

  validateRefreshToken = async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      res.status(401).json({
        message: "Don't have a refresh token",
      });
      return;
    }

    try {
      res.locals.jwt = jwt.verify(refreshToken, env.jwt.refreshSecretKey);
      const user = await this.userService.getByEmail(res.locals.jwt.email);
      if (!user) {
        res.status(401).json({ message: 'Invalid refresh token' });
        return;
      }

      req.body = {
        userId: user.id,
        email: user.email,
        username: user.username,
      };
      return next();
    } catch (error) {
      res.status(403).json({ message: 'Access denied' });
    }
  };
}
