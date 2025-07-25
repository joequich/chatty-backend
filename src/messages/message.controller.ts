import type { NextFunction, Request, Response } from 'express';
import type { MessageService } from './message.service';
import type { RequestQueryMessagesHistory } from './schemas/message.schema';

export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  getMessagesHistory = async (req: RequestQueryMessagesHistory, res: Response, next: NextFunction) => {
    const { cursor, limit } = req.query;
    try {
      const history = await this.messageService.getHistory(limit, cursor);

      res.status(200).json({ status: 'sucess', data: history });
    } catch (error) {
      next(error);
    }
  };
}
