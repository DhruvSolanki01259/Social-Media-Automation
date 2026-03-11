import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendContactEmail = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const response = await resend.emails.send({
      from: "SocialArc Contact <onboarding@resend.dev>",
      to: process.env.ADMIN_EMAIL,
      subject: `New Contact Message from ${name}`,
      reply_to: email,
      html: `
        <div style="font-family:Arial;padding:20px">
          <h2>📩 New Contact Message</h2>

          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>

          <p><strong>Message:</strong></p>

          <div style="background:#f5f5f5;padding:15px;border-radius:8px">
            ${message}
          </div>

        </div>
      `,
    });

    return res.status(200).json({
      success: true,
      message: "Message sent successfully",
      data: response,
    });
  } catch (error) {
    console.error("Resend Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to send message",
    });
  }
};