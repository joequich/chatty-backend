import type { Request, Response } from 'express';
import type { UserService } from './user.service';

export class UserController {
  constructor(private readonly userService: UserService) {}

  getAll = async (_: Request, res: Response) => {
    const users = await this.userService.getAll();
    res.json(users);
  };

  getById = async (req: Request, res: Response) => {
    const { userId: id, email, username } = req.body.user;
    res
      .status(200)
      .json({ success: true, data: { user: { id, email, username } } });
  };
}
