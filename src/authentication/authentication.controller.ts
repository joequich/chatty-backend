import type { Request, Response } from 'express';
import type { AuthenticationService } from './authentication.service';

export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  async signUp(req: Request, res: Response) {
    const user = await this.authenticationService.signUp(req.body);
    res.status(201).json(user);
  }

  async signIn(req: Request, res: Response) {
    const user = await this.authenticationService.getAuthenticatedUser(req.body);
    const { accessToken, refreshTokenExpiration, refreshToken } = this.authenticationService.getJwtTokens(user.id);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      path: '/',
      maxAge: refreshTokenExpiration,
      sameSite: 'strict',
    });
    res.status(201).json({ username: user.username, accessToken });
  }
}
