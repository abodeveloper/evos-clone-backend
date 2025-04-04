import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async sendVerificationEmail(email: string, code: string) {
    await this.transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Email tasdiqlash',
      text: `Tasdiqlash kodingiz: ${code}`,
    });
  }
}
