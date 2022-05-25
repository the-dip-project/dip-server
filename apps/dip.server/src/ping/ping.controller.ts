import { ResponseDTO } from '@/common/models/dto/response.dto';
import { Controller, Get, HttpStatus, Req } from '@nestjs/common';
import { Request } from 'express';
import { PingService } from './ping.service';

@Controller('/api/ping')
export class PingController {
  public constructor(private readonly pingService: PingService) {}

  @Get()
  public ping(@Req() request: Request): ResponseDTO<string> {
    return new ResponseDTO(
      HttpStatus.OK,
      [],
      this.pingService.parseAddress(
        (request.headers['x-forwarded-for'] ||
          request.socket.remoteAddress) as string,
      ),
    );
  }
}
