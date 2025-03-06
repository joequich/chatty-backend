import type { Request, Response } from 'express';
import type { AuthenticationService } from './authentication.service';

export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  async signUp(req: Request, res: Response) {
    const user = await this.authenticationService.signUp(req.body);
    res.status(201).json(user);
  }
}
