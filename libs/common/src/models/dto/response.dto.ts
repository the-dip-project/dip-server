import { HttpStatus } from '@nestjs/common';

export class ResponseDTO<BodyType> {
  statusCode: HttpStatus;
  message: string[];
  body?: BodyType;

  constructor(status: HttpStatus, message: string[], body?: BodyType) {
    this.statusCode = status;
    this.message = message;
    this.body = body;
  }
}
