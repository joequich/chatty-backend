import type { NextFunction, Request, Response } from 'express';
import type { HttpException } from '../../utils/http-exception';

const errorHandler = (error: HttpException, req: Request, res: Response, next: NextFunction) => {
  const status = error.status || 500;
  const message = error.message || 'Unknow failure';
  console.error(error.stack);
  res.status(status).json({
    message,
    ...(Boolean(error.errorCode) && { error_code: error.errorCode }),
  });
};

export default errorHandler;
