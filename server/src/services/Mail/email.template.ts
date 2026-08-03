// src/templates/email/baseTemplate.ts

export interface EmailTemplateOptions {
  title: string;
  previewText?: string;
  greeting?: string;
  message: string;
  buttonText?: string;
  buttonUrl?: string;
  footerText?: string;
}

export const generateEmailTemplate = (
  options: EmailTemplateOptions,
): string => {
  const {
    title,
    previewText = title,
    greeting = "Hello,",
    message,
    buttonText,
    buttonUrl,
    footerText = "If you didn't request this email, you can safely ignore it.",
  } = options;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Encoding" content="IE=edge">
  <title>${title}</title>
  <style>
    /* Dark Mode Support */
    @media (prefers-color-scheme: dark) {
      body, .email-body {
        background-color: #0f172a !important;
        color: #f1f5f9 !important;
      }
      .email-card {
        background-color: #1e293b !important;
        border-color: #334155 !important;
      }
      .email-title {
        color: #f8fafc !important;
      }
      .email-text {
        color: #cbd5e1 !important;
      }
      .footer-text {
        color: #64748b !important;
      }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
  
  <!-- Preview Text (Hidden from visible mail body) -->
  <div style="display: none; max-height: 0; overflow: hidden; opacity: 0; font-size: 1px; line-height: 1px;">
    ${previewText}
  </div>

  <!-- Outer Container Table -->
  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; padding: 40px 10px;" class="email-body">
    <tr>
      <td align="center">
        
        <!-- Main Card Container -->
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 520px; background-color: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);" class="email-card">
          
          <!-- Header / Accent Bar -->
          <tr>
            <td style="background-color: #2563eb; height: 6px; font-size: 0; line-height: 0;">&nbsp;</td>
          </tr>

          <!-- Content Padding -->
          <tr>
            <td style="padding: 40px 32px;">
              
              <!-- Title -->
              <h1 class="email-title" style="margin: 0 0 20px 0; font-size: 22px; font-weight: 700; color: #0f172a; line-height: 1.3;">
                ${title}
              </h1>

              <!-- Greeting & Message Body -->
              <p class="email-text" style="margin: 0 0 12px 0; font-size: 15px; color: #475569; line-height: 1.6;">
                ${greeting}
              </p>
              <p class="email-text" style="margin: 0 0 28px 0; font-size: 15px; color: #475569; line-height: 1.6;">
                ${message}
              </p>

              <!-- Optional Call to Action Button -->
              ${
                buttonText && buttonUrl
                  ? `
              <table role="presentation" border="0" cellspacing="0" cellpadding="0" style="margin: 32px 0;">
                <tr>
                  <td align="center" style="border-radius: 8px; background-color: #2563eb;">
                    <a href="${buttonUrl}" target="_blank" style="display: inline-block; padding: 14px 28px; font-size: 15px; font-weight: 600; color: #ffffff; text-decoration: none; border-radius: 8px; background-color: #2563eb;">
                      ${buttonText}
                    </a>
                  </td>
                </tr>
              </table>
              <p class="email-text" style="margin: 0 0 16px 0; font-size: 13px; color: #94a3b8; word-break: break-all;">
                Or copy and paste this link in your browser: <br/>
                <a href="${buttonUrl}" style="color: #2563eb; text-decoration: underline;">${buttonUrl}</a>
              </p>
              `
                  : ""
              }

              <!-- Divider -->
              <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 32px 0 24px 0;" />

              <!-- Footer -->
              <p class="footer-text" style="margin: 0; font-size: 13px; color: #94a3b8; line-height: 1.5;">
                ${footerText}
              </p>

            </td>
          </tr>
        </table>

      </td>
    </tr>
  </table>

</body>
</html>
  `.trim();
};

export const emailVerificationTemplate = (url: string) => {
  return generateEmailTemplate({
    title: "Verify your email address",
    previewText: "Please verify your email address to activate your account.",
    greeting: "Welcome aboard!",
    message:
      "Thanks for signing up. Please click the button below to verify your email address and activate your account.",
    buttonText: "Verify Email",
    buttonUrl: url,
    footerText:
      "This link will expire in 24 hours. If you didn't create an account, no further action is required.",
  });
};

export const passwordResetTemplate = (url: string) => {
  return generateEmailTemplate({
    title: "Reset your password",
    previewText: "Request to reset your password",
    message:
      "We received a request to reset your password. Click the button below to choose a new password.",
    buttonText: "Reset Password",
    buttonUrl: url,
    footerText:
      "This link is valid for 15 minutes only. If you didn't request a password reset, please secure your account.",
  });
};
