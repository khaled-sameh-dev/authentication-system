import nodemailer from "nodemailer";

import env from "@/config/env";

import { IEmailService } from "./email.interface";
import { SendEmailPayload } from "@/types/Verification";

export class NodemailerEmailService implements IEmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: Number(env.SMTP_PORT),
      secure: Number(env.SMTP_PORT) === 465,
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
      },
      family: 4,
      tls: {
        rejectUnauthorized: false,
      },
      connectionTimeout: 10000,
    });
  }

  async send(data: SendEmailPayload): Promise<void> {
    await this.transporter.sendMail({
      from: env.MAIL_FROM,
      to: data.to,
      subject: data.subject,
      html: data.html,
    });
  }
}
