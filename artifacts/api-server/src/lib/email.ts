const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.FROM_EMAIL ?? "MyPassUK <noreply@mypassuk.co.uk>";
const SITE_URL = process.env.SITE_URL ?? "https://exam-navigator-MatthewNyamasok.replit.app";

export async function sendPasswordResetEmail(
  toEmail: string,
  token: string,
): Promise<{ sent: boolean }> {
  const resetUrl = `${SITE_URL}/reset-password?token=${token}`;

  if (!RESEND_API_KEY) {
    console.warn(
      `[Password Reset] RESEND_API_KEY not set. Reset link for ${toEmail}: ${resetUrl}`,
    );
    return { sent: false };
  }

  const html = `
<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto; color: #1e293b; background: #f8fafc; padding: 24px;">
  <div style="background: white; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0;">
    <div style="background: linear-gradient(135deg, hsl(224,76%,28%), hsl(354,72%,40%)); height: 5px;"></div>
    <div style="padding: 36px 32px;">
      <div style="display: flex; align-items: center; margin-bottom: 24px;">
        <span style="font-size: 22px; font-weight: 800; color: hsl(224,76%,28%);">MyPass</span>
        <span style="font-size: 22px; font-weight: 800; background: linear-gradient(135deg, hsl(224,76%,28%), hsl(354,72%,40%)); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">UK</span>
      </div>
      <h1 style="font-size: 22px; font-weight: 700; margin: 0 0 12px; color: #0f172a;">Reset your password</h1>
      <p style="color: #64748b; margin: 0 0 28px; line-height: 1.6;">
        You requested a password reset for your MyPassUK account. Click the button below to set a new password. This link expires in <strong>1 hour</strong>.
      </p>
      <a href="${resetUrl}"
         style="display: inline-block; padding: 14px 32px; background: hsl(224,76%,28%); color: white; text-decoration: none; border-radius: 10px; font-weight: 700; font-size: 15px; letter-spacing: 0.01em;">
        Reset Password
      </a>
      <p style="margin: 28px 0 0; font-size: 13px; color: #94a3b8; line-height: 1.6;">
        If you didn't request this, you can safely ignore this email — your password won't change.<br/><br/>
        Can't click the button? Copy this link:<br/>
        <a href="${resetUrl}" style="color: hsl(224,76%,28%); word-break: break-all;">${resetUrl}</a>
      </p>
    </div>
  </div>
  <p style="text-align: center; font-size: 12px; color: #94a3b8; margin-top: 20px;">
    Simunye Art Limited · 85 Great Portland Street, London W1W 7LT<br/>
    <a href="${SITE_URL}" style="color: #94a3b8;">mypassuk.co.uk</a>
  </p>
</body>
</html>`.trim();

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to: [toEmail],
      subject: "Reset your MyPassUK password",
      html,
      text: `You requested a password reset for your MyPassUK account.\n\nClick the link below to set a new password. This link expires in 1 hour.\n\n${resetUrl}\n\nIf you did not request this, please ignore this email.\n\n— The MyPassUK Team`,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    console.error(`[Password Reset] Resend API error ${res.status}: ${body}`);
    return { sent: false };
  }

  return { sent: true };
}
