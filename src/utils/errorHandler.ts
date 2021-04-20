import { HttpException, HttpStatus } from '@nestjs/common';

interface ErrorHandlerType extends Error {
  status?: HttpStatus;
}

export const ErrorHandler = (error: ErrorHandlerType) => {
  const status = error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR;
  throw new HttpException(error.message, status);
};
