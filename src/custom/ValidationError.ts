export interface errorObj {
  message: string;
  field: string;
}

class ValidateError extends Error {
  statusCode: number;
  errors: errorObj[];

  constructor(message: string, statusCode: number, errors: errorObj[]) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

export default ValidateError;
