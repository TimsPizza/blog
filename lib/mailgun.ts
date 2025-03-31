import formData from "form-data";
import Mailgun from "mailgun.js";

const MAILGUN_API_KEY = process.env.MAILGUN_API_KEY!;
const MAILGUN_DOMAIN = process.env.MAILGUN_DOMAIN!;

const mailgun = new Mailgun(formData);
const client = mailgun.client({ username: "api", key: MAILGUN_API_KEY });

interface SendEmailParams {
  to: string[];
  subject: string;
  html: string;
  from?: string;
}

export async function sendEmail({
  to,
  subject,
  html,
  from = `tim's nest subscription <subscription@${MAILGUN_DOMAIN}>`,
}: SendEmailParams) {
  try {
    const result = await client.messages.create(MAILGUN_DOMAIN, {
      from: from,
      to: to,
      subject: subject,
      html: html,
    });

    console.log("[MAILGUN_SEND_SUCCESS]", result);
    return { success: true, messageId: result.id };
  } catch (error) {
    console.error("[MAILGUN_SEND_ERROR]", error);
    throw error;
  }
}
