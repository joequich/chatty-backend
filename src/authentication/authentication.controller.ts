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
      const { id, email, username } =
        await this.authenticationService.getAuthenticatedUser(req.body);
      const { refreshTokenExpiration, refreshToken } =
        await this.authenticationService.createRefreshToken(id, email);
      const { accessToken } = this.authenticationService.createAccessToken(
        id,
        email,
      );

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        maxAge: refreshTokenExpiration,
        sameSite: 'strict',
        // secure: env.nodeEnv === 'production'
      });
      res.status(201).json({
        success: true,
        data: { access_token: accessToken, user: { id, email, username } },
      });
    } catch (error) {
      next(error);
    }
  };

  refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const currentRefreshToken = req.cookies?.refreshToken;
      const { userId, email } = req.body.user;
      const { refreshTokenExpiration, refreshToken } =
        await this.authenticationService.createRefreshToken(
          userId,
          email,
          currentRefreshToken,
        );
      const { accessToken } = this.authenticationService.createAccessToken(
        userId,
        email,
      );

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        maxAge: refreshTokenExpiration,
        sameSite: 'strict',
        // secure: env.nodeEnv === 'production'
      });
      res
        .status(201)
        .json({ success: true, data: { access_token: accessToken } });
    } catch (error) {
      next(error);
    }
  };

  signOut = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const refreshToken = req.cookies.refreshToken;

      if (refreshToken) {
        await this.authenticationService.killToken(refreshToken);
      }

      res.clearCookie('refreshToken');

      res.status(201).json({ success: true });
    } catch (error) {
      next(error);
    }
  };
}
