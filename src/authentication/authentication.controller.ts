import type { NextFunction, Request, Response } from 'express';
import type { AuthenticationService } from './authentication.service';

export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  signUp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.authenticationService.signUp(req.body);
      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  };

  signIn = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { username, id, email } = await this.authenticationService.getAuthenticatedUser(req.body);
      const { accessToken, refreshTokenExpiration, refreshToken } = this.authenticationService.getJwtTokens(id, email);

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        path: '/',
        maxAge: refreshTokenExpiration,
        sameSite: 'strict',
      });
      res.status(201).json({ username, accessToken });
    } catch (error) {
      next(error);
    }
  };

  refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { username, id, email } = req.body;
      const { accessToken } = this.authenticationService.getJwtTokens(id, email);

      res.status(201).json({ username, accessToken });
    } catch (error) {
      next(error);
    }
  };
}
