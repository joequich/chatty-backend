export class HttpException extends Error {
  public status: number;
  public message: string;
  public errorCode: string | null;
  constructor(status: number, message: string, errorCode: string | null = null) {
    super(message);
    this.status = status;
    this.message = message;
    this.errorCode = errorCode;
  }
}
