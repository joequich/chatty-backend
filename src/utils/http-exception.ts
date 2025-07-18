export class HttpException extends Error {
  public status: number;
  public message: string;
  public errorCode?: string;
  public details?: unknown;
  constructor(
    status: number,
    message: string,
    errorCode?: string,
    details?: unknown,
  ) {
    super(message);
    this.status = status;
    this.message = message;
    this.errorCode = errorCode;
    this.details = details;
  }
}
