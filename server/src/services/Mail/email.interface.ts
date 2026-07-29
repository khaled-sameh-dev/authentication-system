
export interface IEmailService {
  send(data: SendEmailPayload): Promise<void>;
}
