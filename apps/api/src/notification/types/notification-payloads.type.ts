export type PushPayload = {
  title: string;
  body: string;
  data?: Record<string, string>;
};

export type EmailPayload = {
  subject: string;
  body: string;
  htmlBody?: string;
  templateId?: string;
  templateVersion?: string;
};

export type SmsPayload = {
  body: string;
};
