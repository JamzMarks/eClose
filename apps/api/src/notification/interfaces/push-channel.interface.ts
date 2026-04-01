import { ChannelSendResult } from "./email-channel.interface";

export type PushSendInput = {
  tokens: string[];
  title: string;
  body: string;
  data?: Record<string, string>;
};

export interface IPushChannel {
  send(input: PushSendInput): Promise<ChannelSendResult>;
}
