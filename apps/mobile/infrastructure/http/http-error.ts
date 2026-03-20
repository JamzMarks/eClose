export type HttpError = {
  message: string;
  status: number;
  code?: string;
};

export type ApiError = HttpError & {
  details?: any;
};

export class ApiException extends Error {
  status: number;
  code?: string;
  details?: any;

  constructor({ message, status, code, details }: ApiError) {
    super(message);
    this.name = 'ApiException';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}