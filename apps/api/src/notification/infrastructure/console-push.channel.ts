import { Injectable, Logger } from "@nestjs/common";
import { IPushChannel, PushSendInput } from "../interfaces/push-channel.interface";
import { ChannelSendResult } from "../interfaces/email-channel.interface";
import { randomUUID } from "crypto";

@Injectable()
export class ConsolePushChannel implements IPushChannel {
  private readonly log = new Logger(ConsolePushChannel.name);

  async send(input: PushSendInput): Promise<ChannelSendResult> {
    this.log.log(
      `[push] tokens=${input.tokens.length} title=${input.title} body=${input.body.slice(0, 80)}…`,
    );
    return { externalId: randomUUID() };
  }
}
