import { SendEmailPayload } from "@/types/Verification";

export interface IEmailService {
  send(data: SendEmailPayload): Promise<void>;
}
