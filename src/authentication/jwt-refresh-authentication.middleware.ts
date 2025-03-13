import type { NextFunction, Request, Response } from 'express';
import type { UserService } from '../user/user.service';

class JwtRefreshAuthenticationMiddleware {
  constructor(private readonly userService: UserService) {}

  validateRefreshToken(req: Request, res: Response, next: NextFunction) {
    //
  }
}
