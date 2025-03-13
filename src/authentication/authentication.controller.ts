import type { Request, Response } from 'express';
import type { AuthenticationService } from './authentication.service';

export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  async signUp(req: Request, res: Response) {
    const user = await this.authenticationService.signUp(req.body);
    res.status(201).json(user);
  }

  async signIn(req: Request, res: Response) {
    const { username, id, email } = await this.authenticationService.getAuthenticatedUser(req.body);
    const { accessToken, refreshTokenExpiration, refreshToken } = this.authenticationService.getJwtTokens(id, email);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      path: '/',
      maxAge: refreshTokenExpiration,
      sameSite: 'strict',
    });
    res.status(201).json({ username, accessToken });
  }

  async refreshToken(req: Request, res: Response) {
    const { username, id, email } = req.body;
    const { accessToken } = this.authenticationService.getJwtTokens(id, email);

    res.status(201).json({ username, accessToken });
  }
}
