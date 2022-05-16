import { Packet } from 'dns2';

import { Injectable, Scope } from '@nestjs/common';

@Injectable({
  scope: Scope.DEFAULT,
})
export class DnsService {
  public async handle(request, send, _remoteInfo): Promise<void> {
    const response = Packet.createResponseFromRequest(request);

    response.answers.push({
      name: 'test_message',
      type: Packet.TYPE.A,
      class: Packet.CLASS.IN,
      ttl: 60,
      address: '0.0.0.0',
    });

    send(response);
  }
}
