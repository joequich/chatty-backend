import type { Request, Response } from 'express';
import type { UserService } from './user.service';

export class UserController {
  constructor(private readonly userService: UserService) {}

  async getAll(_: Request, res: Response) {
    const users = await this.userService.getAll();
    res.json(users);
  }
}
