import { Injectable, Logger } from "@nestjs/common";
import { ChannelSendResult } from "../interfaces/email-channel.interface";
import { ISmsChannel, SmsSendInput } from "../interfaces/sms-channel.interface";

/**
 * SMS via API HTTP da Twilio quando TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN e TWILIO_FROM estão definidos.
 */
@Injectable()
export class TwilioSmsChannel implements ISmsChannel {
  private readonly log = new Logger(TwilioSmsChannel.name);

  async send(input: SmsSendInput): Promise<ChannelSendResult> {
    const sid = process.env.TWILIO_ACCOUNT_SID;
    const token = process.env.TWILIO_AUTH_TOKEN;
    const from = process.env.TWILIO_FROM;
    if (!sid || !token || !from) {
      throw new Error("TwilioSmsChannel: missing TWILIO_ACCOUNT_SID / TWILIO_AUTH_TOKEN / TWILIO_FROM");
    }
    const auth = Buffer.from(`${sid}:${token}`).toString("base64");
    const body = new URLSearchParams({
      To: input.to,
      From: from,
      Body: input.body,
    });
    const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body.toString(),
    });
    const json = (await res.json()) as { sid?: string; message?: string };
    if (!res.ok) {
      this.log.error(`Twilio error: ${JSON.stringify(json)}`);
      throw new Error(json.message ?? "Twilio SMS failed");
    }
    return { externalId: json.sid };
  }
}
