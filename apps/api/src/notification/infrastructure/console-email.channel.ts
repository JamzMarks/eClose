import { Injectable, Logger } from "@nestjs/common";
import {
  ChannelSendResult,
  EmailSendInput,
  IEmailChannel,
} from "../interfaces/email-channel.interface";
import { randomUUID } from "crypto";

@Injectable()
export class ConsoleEmailChannel implements IEmailChannel {
  private readonly log = new Logger(ConsoleEmailChannel.name);

  async send(input: EmailSendInput): Promise<ChannelSendResult> {
    this.log.log(
      `[email] to=${input.to} subject=${input.subject} body=${input.textBody.slice(0, 120)}…`,
    );
    return { externalId: randomUUID() };
  }
}
