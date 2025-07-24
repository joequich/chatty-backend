import type { NextFunction, Request, Response } from 'express';
import type { MessageService } from './message.service';

export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  getMessagesHistory = async (req: Request, res: Response, next: NextFunction) => {
    const { before, limit } = req.query;
    const parsedLimit = limit ? Number.parseInt(limit as string, 10) : 20;
    const parsedBefore = before ? new Date(before as string) : undefined;

    try {
      const messages = await this.messageService.getHistory(parsedBefore, parsedLimit);
      const hasMore = messages.length === parsedLimit;
      const nextCursor = hasMore ? messages[0].createdAt?.toISOString() : null;

      res.status(200).json({
        status: 'sucess',
        data: { messages, pagination: { nextCursor, hasMore } },
      });
    } catch (error) {
      next(error);
    }
  };
}
