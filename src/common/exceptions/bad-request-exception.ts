import { HttpException } from '../../utils/http-exception';

export class BadRequestException extends HttpException {
  constructor(message = 'Bad Request', errorCode?: string, details?: unknown) {
    super(400, message, errorCode, details);
  }
}
