import nodemailer from "nodemailer";
import env from "@/config/env";
import { IEmailService } from "./email.interface";
import { SendEmailPayload } from "@/types/Verification";
import logger from "@/config/logger";

export class NodemailerEmailService implements IEmailService {
  private transporter;

  constructor() {
    const port = Number(env.SMTP_PORT) || 587;

    this.transporter = nodemailer.createTransport({
      host: env.SMTP_HOST || "smtp.gmail.com",
      port: port,
      secure: port === 465,
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS?.trim(),
      },
      tls: {
        rejectUnauthorized: false,
      },
      connectionTimeout: 10000,
    });

    this.transporter.verify((error) => {
      if (error) {
        logger.error({ message: "❌ SMTP Connection Failed", error });
      } else {
        logger.info("✅ SMTP Server is connected and ready to send emails.");
      }
    });
  }

  async send(data: SendEmailPayload): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: env.MAIL_FROM || env.SMTP_USER,
        to: data.to,
        subject: data.subject,
        html: data.html,
      });
      logger.info(`📧 Email successfully sent to: ${data.to}`);
    } catch (error) {
      logger.error({ message: `❌ Failed to send email to ${data.to}`, error });
      throw error;
    }
  }
}
