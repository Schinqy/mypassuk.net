import nodemailer from "nodemailer";

const SITE_URL = "https://exam-navigator-MatthewNyamasok.replit.app";
const GMAIL_USER = "munyaradzi.nyamasoka@gmail.com";

function buildHtml(resetUrl: string) {
  return `<!DOCTYPE html>
<html>
<body style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;color:#1e293b;background:#f8fafc;padding:24px;">
  <div style="background:white;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;">
    <div style="background:linear-gradient(135deg,hsl(224,76%,28%),hsl(354,72%,40%));height:5px;"></div>
    <div style="padding:36px 32px;">
      <div style="margin-bottom:20px;font-size:22px;font-weight:800;color:hsl(224,76%,28%);">MyPassUK</div>
      <h1 style="font-size:22px;font-weight:700;margin:0 0 12px;color:#0f172a;">Reset your password</h1>
      <p style="color:#64748b;margin:0 0 28px;line-height:1.6;">
        You requested a password reset for your MyPassUK account.<br/>
        Click the button below to set a new password. This link expires in <strong>1 hour</strong>.
      </p>
      <a href="${resetUrl}" style="display:inline-block;padding:14px 32px;background:hsl(224,76%,28%);color:white;text-decoration:none;border-radius:10px;font-weight:700;font-size:15px;">Reset Password</a>
      <p style="margin:28px 0 0;font-size:13px;color:#94a3b8;line-height:1.6;">
        If you didn't request this, you can safely ignore this email.<br/><br/>
        Or copy this link:<br/>
        <a href="${resetUrl}" style="color:hsl(224,76%,28%);word-break:break-all;">${resetUrl}</a>
      </p>
    </div>
  </div>
  <p style="text-align:center;font-size:12px;color:#94a3b8;margin-top:20px;">
    Simunye Art Limited · 85 Great Portland Street, London W1W 7LT
  </p>
</body>
</html>`.trim();
}

function buildText(resetUrl: string) {
  return `You requested a password reset for your MyPassUK account.\n\nClick the link below to set a new password. This link expires in 1 hour.\n\n${resetUrl}\n\nIf you did not request this, please ignore this email.\n\n— The MyPassUK Team`;
}

export async function sendPasswordResetEmail(
  toEmail: string,
  token: string,
): Promise<{ sent: boolean }> {
  // Read env vars lazily (at call time, not module load time)
  const gmailAppPassword = process.env.GMAIL_APP_PASSWORD;
  const resendApiKey = process.env.RESEND_API_KEY;
  const siteUrl = process.env.SITE_URL ?? SITE_URL;

  const resetUrl = `${siteUrl}/reset-password?token=${token}`;

  // 1. Try Gmail SMTP (most reliable for Gmail recipients)
  if (gmailAppPassword) {
    try {
      const transport = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: { user: GMAIL_USER, pass: gmailAppPassword },
      });
      await transport.sendMail({
        from: `"MyPassUK" <${GMAIL_USER}>`,
        to: toEmail,
        subject: "Reset your MyPassUK password",
        text: buildText(resetUrl),
        html: buildHtml(resetUrl),
      });
      console.log(`[Password Reset] Email sent via Gmail SMTP to ${toEmail}`);
      return { sent: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`[Password Reset] Gmail SMTP failed: ${msg}`);
    }
  } else {
    console.warn("[Password Reset] GMAIL_APP_PASSWORD not set, skipping Gmail SMTP");
  }

  // 2. Fall back to Resend
  if (resendApiKey) {
    try {
      const fromEmail = process.env.FROM_EMAIL ?? "MyPassUK <onboarding@resend.dev>";
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: fromEmail,
          to: [toEmail],
          subject: "Reset your MyPassUK password",
          html: buildHtml(resetUrl),
          text: buildText(resetUrl),
        }),
      });
      const body = await res.json() as { id?: string; name?: string; message?: string };
      if (res.ok && body.id) {
        console.log(`[Password Reset] Email sent via Resend to ${toEmail} (id: ${body.id})`);
        return { sent: true };
      }
      console.error(`[Password Reset] Resend error: ${JSON.stringify(body)}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`[Password Reset] Resend failed: ${msg}`);
    }
  }

  // 3. Nothing configured
  console.warn(`[Password Reset] No email service succeeded. Reset link for ${toEmail}: ${resetUrl}`);
  return { sent: false };
}
