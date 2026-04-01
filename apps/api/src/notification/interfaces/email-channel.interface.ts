export type EmailSendInput = {
  to: string;
  subject: string;
  textBody: string;
  htmlBody?: string;
  templateId?: string;
  templateVersion?: string;
};

export type ChannelSendResult = {
  externalId?: string;
};

export interface IEmailChannel {
  send(input: EmailSendInput): Promise<ChannelSendResult>;
}
