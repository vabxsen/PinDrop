import nodemailer from 'nodemailer';
import { env } from '../config/env.js';
import { logger } from '../lib/logger.js';

let transporter: nodemailer.Transporter | undefined;

function getTransporter() {
  if (!env.SMTP_HOST) return undefined;
  transporter ??= nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_PORT === 465,
    auth: env.SMTP_USER ? { user: env.SMTP_USER, pass: env.SMTP_PASS } : undefined,
  });
  return transporter;
}

export async function sendPasswordResetEmail(to: string, resetUrl: string): Promise<void> {
  const t = getTransporter();

  if (!t) {
    logger.info(`[dev] Password reset link for ${to}: ${resetUrl}`);
    return;
  }

  await t.sendMail({
    from: env.SMTP_FROM,
    to,
    subject: 'Reset your PinDrop password',
    text: `Reset your password by visiting this link: ${resetUrl}\n\nThis link expires in 30 minutes. If you didn't request this, you can ignore this email.`,
    html: `<p>Reset your password by clicking the link below.</p><p><a href="${resetUrl}">${resetUrl}</a></p><p>This link expires in 30 minutes. If you didn't request this, you can ignore this email.</p>`,
  });
}
