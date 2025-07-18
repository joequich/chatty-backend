import type { NextFunction, Request, Response } from 'express';
import type { HttpException } from '../../utils/http-exception';

export const errorHandler = (error: HttpException, req: Request, res: Response, next: NextFunction) => {
  const status = error.status || 500;
  const message = error.message || 'Internal Server Error';
  console.error(error.stack);
  res.status(status).json({
    message,
    ...(error.errorCode && { error_code: error.errorCode }),
    ...(Boolean(error.details) && { details: error.details }),
  });
};
