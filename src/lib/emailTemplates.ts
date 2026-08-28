/**
 * Transactional Email HTML Templates
 * Styled with inline CSS for cross-client compatibility.
 */

export function welcomeEmailTemplate(name: string): string {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://edupulse.vercel.app";

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Welcome to EduPulse Academy</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0b0f19; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f8fafc;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #0b0f19; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #1e293b; border-radius: 16px; overflow: hidden; border: 1px solid #334155; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
          <!-- Header -->
          <tr>
            <td style="background-color: #3D1E6D; padding: 30px; text-align: center;">
              <h1 style="margin: 0; color: #D4AF37; font-size: 26px; font-weight: 800; letter-spacing: -0.5px;">EduPulse Academy</h1>
              <p style="margin: 5px 0 0 0; color: #e2e8f0; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Empowering Your Learning Journey</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="margin: 0 0 15px 0; color: #f8fafc; font-size: 20px; font-weight: 700;">Welcome to the Future of Learning, ${name}! 👋</h2>
              <p style="margin: 0 0 20px 0; color: #94a3b8; font-size: 14px; line-height: 1.6;">
                We are thrilled to have you join our global student community. At EduPulse, you get access to expert-led tech tracks, interactive video classrooms, and printable verified certificates upon completion.
              </p>
              
              <div style="background-color: #0f172a; border-radius: 12px; padding: 20px; border: 1px solid #334155; margin-bottom: 30px;">
                <p style="margin: 0 0 10px 0; color: #D4AF37; font-weight: 700; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">⚡ Quick Start Tips</p>
                <ul style="margin: 0; padding-left: 20px; color: #cbd5e1; font-size: 13px; line-height: 1.6;">
                  <li style="margin-bottom: 6px;">Browse our curated course catalog</li>
                  <li style="margin-bottom: 6px;">Enroll in free or premium interactive video tracks</li>
                  <li>Track your progress on your personal Student Dashboard</li>
                </ul>
              </div>

              <!-- CTA Button -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center">
                    <a href="${appUrl}" target="_blank" style="display: inline-block; background-color: #3D1E6D; color: #ffffff; font-size: 14px; font-weight: 700; text-decoration: none; padding: 14px 30px; border-radius: 10px; border: 1px solid #D4AF37;">
                      Explore Course Catalog &rarr;
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #0f172a; padding: 20px; text-align: center; border-top: 1px solid #334155;">
              <p style="margin: 0; color: #64748b; font-size: 12px;">&copy; ${new Date().getFullYear()} EduPulse Academy. All rights reserved.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

export function orderConfirmationEmailTemplate(opts: {
  name: string;
  courseTitle: string;
  amount: number;
  date: string;
  courseId: string;
}): string {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://edupulse.vercel.app";
  const learnUrl = `${appUrl}/courses/${opts.courseId}`;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Enrollment Confirmation - EduPulse</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0b0f19; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f8fafc;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #0b0f19; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #1e293b; border-radius: 16px; overflow: hidden; border: 1px solid #334155; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
          <!-- Header -->
          <tr>
            <td style="background-color: #3D1E6D; padding: 30px; text-align: center;">
              <h1 style="margin: 0; color: #D4AF37; font-size: 26px; font-weight: 800;">EduPulse Academy</h1>
              <p style="margin: 5px 0 0 0; color: #10b981; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">✅ Enrollment & Order Confirmed</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="margin: 0 0 15px 0; color: #f8fafc; font-size: 20px; font-weight: 700;">Thank You for Your Order, ${opts.name}!</h2>
              <p style="margin: 0 0 25px 0; color: #94a3b8; font-size: 14px; line-height: 1.6;">
                Your payment was processed successfully. Full unlimited access to your new course has been unlocked on your account.
              </p>
              
              <!-- Order Receipt Table -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #0f172a; border-radius: 12px; border: 1px solid #334155; margin-bottom: 30px; overflow: hidden;">
                <tr>
                  <td style="padding: 15px 20px; background-color: #1e293b; border-b: 1px solid #334155; font-size: 12px; font-weight: 700; color: #D4AF37; text-transform: uppercase;">
                    Order Receipt Summary
                  </td>
                </tr>
                <tr>
                  <td style="padding: 20px;">
                    <table width="100%" border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td style="padding-bottom: 12px; color: #94a3b8; font-size: 13px;">Course Title:</td>
                        <td style="padding-bottom: 12px; color: #f8fafc; font-size: 13px; font-weight: 700; text-align: right;">${opts.courseTitle}</td>
                      </tr>
                      <tr>
                        <td style="padding-bottom: 12px; color: #94a3b8; font-size: 13px;">Amount Paid:</td>
                        <td style="padding-bottom: 12px; color: #10b981; font-size: 14px; font-weight: 800; text-align: right;">${opts.amount === 0 ? "Free" : `$${opts.amount.toFixed(2)}`}</td>
                      </tr>
                      <tr>
                        <td style="color: #94a3b8; font-size: 13px;">Transaction Date:</td>
                        <td style="color: #f8fafc; font-size: 13px; font-weight: 600; text-align: right;">${opts.date}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- CTA Button -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center">
                    <a href="${learnUrl}" target="_blank" style="display: inline-block; background-color: #10b981; color: #ffffff; font-size: 14px; font-weight: 700; text-decoration: none; padding: 14px 30px; border-radius: 10px;">
                      Start Learning Now &rarr;
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #0f172a; padding: 20px; text-align: center; border-top: 1px solid #334155;">
              <p style="margin: 0; color: #64748b; font-size: 12px;">&copy; ${new Date().getFullYear()} EduPulse Academy. All rights reserved.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

export function passwordResetEmailTemplate(opts: {
  name: string;
  resetUrl: string;
}): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Reset Your Password - EduPulse</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0b0f19; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f8fafc;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #0b0f19; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #1e293b; border-radius: 16px; overflow: hidden; border: 1px solid #334155; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
          <!-- Header -->
          <tr>
            <td style="background-color: #3D1E6D; padding: 30px; text-align: center;">
              <h1 style="margin: 0; color: #D4AF37; font-size: 26px; font-weight: 800;">EduPulse Academy</h1>
              <p style="margin: 5px 0 0 0; color: #ef4444; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">🔐 Account Security Request</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="margin: 0 0 15px 0; color: #f8fafc; font-size: 20px; font-weight: 700;">Password Reset Request</h2>
              <p style="margin: 0 0 20px 0; color: #94a3b8; font-size: 14px; line-height: 1.6;">
                Hi ${opts.name}, we received a request to reset the password for your EduPulse account. Click the button below to set a new password.
              </p>
              
              <div style="background-color: #0f172a; border-radius: 12px; padding: 15px 20px; border: 1px solid #334155; margin-bottom: 25px;">
                <p style="margin: 0; color: #f59e0b; font-weight: 600; font-size: 13px;">
                  ⚠️ This security link will expire in <strong>15 minutes</strong>. If you did not request this, you can safely ignore this email.
                </p>
              </div>

              <!-- CTA Button -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center">
                    <a href="${opts.resetUrl}" target="_blank" style="display: inline-block; background-color: #ef4444; color: #ffffff; font-size: 14px; font-weight: 700; text-decoration: none; padding: 14px 30px; border-radius: 10px;">
                      Reset Password Now &rarr;
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #0f172a; padding: 20px; text-align: center; border-top: 1px solid #334155;">
              <p style="margin: 0; color: #64748b; font-size: 12px;">&copy; ${new Date().getFullYear()} EduPulse Academy. All rights reserved.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}
