import { Injectable } from '@nestjs/common';

@Injectable()
export class PingService {
  public parseAddress(address: string): string {
    if (typeof address !== 'string') return address;

    if (address.substring(0, 7) == '::ffff:') {
      address = address.substring(7);
    }

    return address;
  }
}
