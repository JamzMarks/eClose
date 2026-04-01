import { ChannelSendResult } from "./email-channel.interface";

export type SmsSendInput = {
  to: string;
  body: string;
};

export interface ISmsChannel {
  send(input: SmsSendInput): Promise<ChannelSendResult>;
}
