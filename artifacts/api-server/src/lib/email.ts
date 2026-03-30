import nodemailer from "nodemailer";

const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = parseInt(process.env.SMTP_PORT ?? "587", 10);
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const FROM_EMAIL = process.env.FROM_EMAIL ?? "noreply@mypassuk.co.uk";
const SITE_URL = process.env.SITE_URL ?? "https://exam-navigator-MatthewNyamasok.replit.app";

function getTransport() {
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return null;
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
}

export async function sendPasswordResetEmail(
  toEmail: string,
  token: string,
): Promise<{ sent: boolean }> {
  const resetUrl = `${SITE_URL}/reset-password?token=${token}`;

  const transport = getTransport();

  if (!transport) {
    console.warn(
      `[Password Reset] SMTP not configured. Reset link for ${toEmail}: ${resetUrl}`,
    );
    return { sent: false };
  }

  await transport.sendMail({
    from: `"MyPassUK" <${FROM_EMAIL}>`,
    to: toEmail,
    subject: "Reset your MyPassUK password",
    text: `
You requested a password reset for your MyPassUK account.

Click the link below to set a new password. This link expires in 1 hour.

${resetUrl}

If you did not request this, please ignore this email — your password will not change.

— The MyPassUK Team
    `.trim(),
    html: `
<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto; color: #1e293b;">
  <div style="background: linear-gradient(135deg, hsl(224,76%,28%), hsl(354,72%,40%)); height: 4px; border-radius: 4px 4px 0 0;"></div>
  <div style="padding: 32px 24px; background: #fff; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 12px 12px;">
    <h1 style="font-size: 22px; font-weight: 700; margin: 0 0 8px;">Reset your password</h1>
    <p style="color: #64748b; margin: 0 0 24px;">You requested a password reset for your MyPassUK account. Click the button below to set a new password. This link expires in <strong>1 hour</strong>.</p>
    <a href="${resetUrl}" style="display: inline-block; padding: 12px 28px; background: hsl(224,76%,28%); color: white; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 15px;">Reset Password</a>
    <p style="margin: 24px 0 0; font-size: 13px; color: #94a3b8;">If you did not request this, please ignore this email — your password will not change.<br/>Or copy this link: <a href="${resetUrl}" style="color: hsl(224,76%,28%);">${resetUrl}</a></p>
  </div>
  <p style="text-align: center; font-size: 12px; color: #94a3b8; margin-top: 16px;">MyPassUK · 85 Great Portland Street, London W1W 7LT</p>
</body>
</html>
    `.trim(),
  });

  return { sent: true };
}
