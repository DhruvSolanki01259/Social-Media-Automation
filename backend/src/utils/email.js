// src/utils/email.js
import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;

if (!apiKey) {
  console.warn(
    "⚠️ RESEND_API_KEY is missing in .env. Email sending will fail!"
  );
}

const resend = apiKey ? new Resend(apiKey) : null;

export const contactEmail = async (to, subject, htmlContent) => {
  if (!resend) {
    console.error("Cannot send email: RESEND_API_KEY not set");
    return;
  }

  try {
    const response = await resend.emails.send({
      from: "Social-Media-Automation <onboarding@resend.dev>",
      to,
      subject,
      html: htmlContent,
    });
    console.log("Resend email response:", response);
    return response;
  } catch (error) {
    console.error("Error sending contact email via Resend:", error);
    throw new Error("Failed to send contact email");
  }
};