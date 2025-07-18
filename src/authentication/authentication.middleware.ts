import type { NextFunction, Request, Response } from 'express';
import type { AuthenticationService } from './authentication.service';

export class AuthenticationMiddleware {
  constructor(private readonly authService: AuthenticationService) {}

  validateRefreshToken = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      res.status(401).json({ message: 'No refresh token was found' });
      return;
    }

    try {
      await this.authService.getRefreshToken(refreshToken);
      const user = await this.authService.getUserByRefreshToken(refreshToken);

      req.body.user = {
        userId: user.id,
        email: user.email,
        username: user.username,
      };
      return next();
    } catch (error) {
      res
        .status(401)
        .json({ message: 'Invalid or expired access token. Access denied' });
    }
  };

  validateJwt = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const authParts = authHeader?.split(' ');

    if (authParts?.length !== 2) {
      res.status(401).json({ message: 'No access token was found' });
      return;
    }

    const [type, credential] = authParts;
    if (type !== 'Bearer') {
      res.status(401).json({ message: 'Bad format of authorization' });
      return;
    }
    try {
      const user = await this.authService.getUserByAccessToken(credential);

      req.body.user = {
        userId: user.id,
        email: user.email,
        username: user.username,
      };
      return next();
    } catch (error) {
      res
        .status(401)
        .json({ message: 'Invalid or expired access token. Access denied' });
    }
  };
}
