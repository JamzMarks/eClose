import { Injectable, Logger } from "@nestjs/common";
import * as nodemailer from "nodemailer";
import {
  ChannelSendResult,
  EmailSendInput,
  IEmailChannel,
} from "../interfaces/email-channel.interface";

@Injectable()
export class SmtpEmailChannel implements IEmailChannel {
  private readonly log = new Logger(SmtpEmailChannel.name);
  private readonly transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? "587"),
    secure: process.env.SMTP_SECURE === "true",
    auth:
      process.env.SMTP_USER && process.env.SMTP_PASS
        ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
        : undefined,
  });

  async send(input: EmailSendInput): Promise<ChannelSendResult> {
    const from = process.env.SMTP_FROM ?? process.env.SMTP_USER ?? "no-reply@localhost";
    const info = await this.transporter.sendMail({
      from,
      to: input.to,
      subject: input.subject,
      text: input.textBody,
      html: input.htmlBody,
    });
    this.log.log(`SMTP sent messageId=${info.messageId}`);
    return { externalId: info.messageId };
  }
}
