import { Injectable, Logger } from "@nestjs/common";
import { randomUUID } from "crypto";
import { ChannelSendResult } from "../interfaces/email-channel.interface";
import { IPushChannel, PushSendInput } from "../interfaces/push-channel.interface";

/**
 * FCM legado (server key) — só quando FCM_SERVER_KEY está definido; caso contrário falha em runtime se selecionado.
 */
@Injectable()
export class FcmLegacyPushChannel implements IPushChannel {
  private readonly log = new Logger(FcmLegacyPushChannel.name);

  async send(input: PushSendInput): Promise<ChannelSendResult> {
    const key = process.env.FCM_SERVER_KEY;
    if (!key) {
      throw new Error("FcmLegacyPushChannel: set FCM_SERVER_KEY");
    }
    const res = await fetch("https://fcm.googleapis.com/fcm/send", {
      method: "POST",
      headers: {
        Authorization: `key=${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        registration_ids: input.tokens,
        notification: { title: input.title, body: input.body },
        data: input.data,
      }),
    });
    const json = (await res.json()) as { success?: number; failure?: number; results?: unknown };
    if (!res.ok) {
      this.log.error(`FCM error: ${JSON.stringify(json)}`);
      throw new Error("FCM send failed");
    }
    this.log.log(`FCM success=${json.success} failure=${json.failure}`);
    return { externalId: randomUUID() };
  }
}
