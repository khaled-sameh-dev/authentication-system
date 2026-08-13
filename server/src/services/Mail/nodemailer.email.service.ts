import nodemailer from "nodemailer";
import env from "@/config/env";
import { IEmailService } from "./email.interface";
import { SendEmailPayload } from "@/types/Verification";

export class NodemailerEmailService implements IEmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS?.trim(),
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
      from: env.MAIL_FROM || env.SMTP_USER,
      to: data.to,
      subject: data.subject,
      html: data.html,
    });
  }
}
