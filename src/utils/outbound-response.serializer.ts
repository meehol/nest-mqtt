import { Serializer, OutgoingResponse } from '@nestjs/microservices';

export class OutboundResponseSerializer implements Serializer {
  serialize(value: any): OutgoingResponse {
    return value.data;
  }
}
