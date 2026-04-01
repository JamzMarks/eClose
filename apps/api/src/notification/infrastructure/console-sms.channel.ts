import { Injectable, Logger } from "@nestjs/common";
import { ISmsChannel, SmsSendInput } from "../interfaces/sms-channel.interface";
import { ChannelSendResult } from "../interfaces/email-channel.interface";
import { randomUUID } from "crypto";

@Injectable()
export class ConsoleSmsChannel implements ISmsChannel {
  private readonly log = new Logger(ConsoleSmsChannel.name);

  async send(input: SmsSendInput): Promise<ChannelSendResult> {
    this.log.log(`[sms] to=${input.to} body=${input.body.slice(0, 80)}…`);
    return { externalId: randomUUID() };
  }
}
