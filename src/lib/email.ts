import { Resend } from "resend";

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

let resendInstance: Resend | null = null;

function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("⚠️ RESEND_API_KEY is missing. Email dispatch will be simulated in server logs.");
    return null;
  }
  if (!resendInstance) {
    resendInstance = new Resend(apiKey);
  }
  return resendInstance;
}

/**
 * Sends a transactional email asynchronously without blocking or throwing errors.
 */
export async function sendEmail({ to, subject, html }: SendEmailOptions): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const resend = getResendClient();
    const from = process.env.EMAIL_FROM || "EduPulse Academy <onboarding@resend.dev>";

    if (!resend) {
      console.log(`[SIMULATED EMAIL] To: ${to} | Subject: "${subject}"`);
      return { success: true, id: "simulated_email_id" };
    }

    const response = await resend.emails.send({
      from,
      to,
      subject,
      html,
    });

    if (response.error) {
      console.error(`❌ Resend Email Error sending to ${to}:`, response.error);
      return { success: false, error: response.error.message };
    }

    console.log(`✅ Email sent successfully to ${to} (ID: ${response.data?.id})`);
    return { success: true, id: response.data?.id };
  } catch (err: any) {
    console.error(`❌ Exception sending email to ${to}:`, err.message || err);
    return { success: false, error: err.message || "Failed to send email" };
  }
}
