import type { NextFunction, Request, Response } from 'express';
import type { ZodSchema } from 'zod';
import { BadRequestException } from '../exceptions/bad-request-exception';

type SourceField = 'body' | 'query' | 'params';

export const validateFields =
  (schema: ZodSchema, source: SourceField = 'body') =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      return next(
        new BadRequestException(
          'Invalid request data',
          'INVALID_REQUEST_DATA',
          result.error.flatten(),
        ),
      );
    }

    req[source] = result.data;
    next();
  };
