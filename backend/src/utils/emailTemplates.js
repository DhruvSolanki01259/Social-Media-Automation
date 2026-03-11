export const contactEmailTemplate = (name, email, message) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Contact Message</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: 'Inter', sans-serif;
      background-color: #FFF8F0;
      color: #3E3E3E;
      line-height: 1.5;
    }

    a { color: #FA9500; text-decoration: none; }

    .container {
      max-width: 640px;
      width: 90%;
      margin: 40px auto;
      border: 2px solid #FA9500;
      border-radius: 16px;
      padding: 32px;
      background-color: #FFFFFF;
      box-shadow: 0 6px 20px rgba(250,149,0,0.2);
    }

    .header {
      text-align: center;
      margin-bottom: 24px;
    }

    .header h1 {
      margin: 0;
      font-size: 30px;
      color: #7C6A0A;
    }

    .sender-info {
      margin-bottom: 24px;
      padding-bottom: 16px;
      border-bottom: 2px solid #EB6424;
    }

    .sender-info p {
      margin: 6px 0;
    }

    .message-box {
      padding: 24px;
      border: 2px solid #FFDAC6;
      border-radius: 16px;
      box-shadow: 0 0 20px rgba(255,218,198,0.5);
      background-color: #FFF3E6;
      margin-bottom: 24px;
      font-size: 16px;
      color: #3E3E3E;
    }

    .footer {
      text-align: center;
      font-size: 12px;
      color: #6B7280;
    }

    @media (prefers-color-scheme: dark) {
      body { background-color: #111827; color: #F3F3F3; }
      .container { border-color: #FA9500; background-color: #1F2937; box-shadow: 0 6px 20px rgba(250,149,0,0.3); }
      .header h1 { color: #FFDAC6; }
      .sender-info { border-color: #EB6424; }
      .message-box { border-color: #FA9500; box-shadow: 0 0 16px rgba(250,149,0,0.5); background-color: #1F2937; color: #F3F3F3; }
      a { color: #FA9500; }
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header -->
    <div class="header">
      <h1>SocialArc Contact</h1>
    </div>

    <!-- Sender Info -->
    <div class="sender-info">
      <p><strong>Sender Name:</strong> ${name}</p>
      <p><strong>Sender Email:</strong> <a href="mailto:${email}">${email}</a></p>
    </div>

    <!-- Message -->
    <div class="message-box">
      <p>${message}</p>
    </div>

    <!-- Footer -->
    <div class="footer">
      This email was sent via <strong>SocialArc</strong> contact form.<br>
      © ${new Date().getFullYear()} SocialArc. All rights reserved.
    </div>
  </div>
</body>
</html>
`;