import { Resend } from 'resend';

// Lazy initialization - only create Resend instance when API key is available
let resend: Resend | null = null;

function getResendClient() {
  if (!process.env.RESEND_API_KEY) {
    return null;
  }
  if (!resend) {
    resend = new Resend(process.env.RESEND_API_KEY);
  }
  return resend;
}

export async function sendPasswordResetEmail(email: string, resetToken: string) {
  const resetUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/auth/reset-password?token=${resetToken}`;

  const client = getResendClient();
  if (!client) {
    console.warn('Resend API key not configured - email not sent');
    return { success: false, error: 'Email service not configured' };
  }

  try {
    await client.emails.send({
      from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
      to: email,
      subject: 'Reset Your Password - IntoBrick',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Helvetica Neue", Arial, sans-serif;
                line-height: 1.6;
                color: #171717;
                margin: 0;
                padding: 0;
                background-color: #fafafa;
              }
              .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 40px 20px;
              }
              .card {
                background: #ffffff;
                border-radius: 12px;
                padding: 48px;
                box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
              }
              h1 {
                font-size: 28px;
                font-weight: 700;
                margin: 0 0 16px 0;
                color: #171717;
              }
              p {
                margin: 0 0 24px 0;
                color: #525252;
                font-size: 16px;
              }
              .button {
                display: inline-block;
                padding: 16px 32px;
                background: #3b82f6;
                color: #ffffff !important;
                text-decoration: none;
                border-radius: 8px;
                font-weight: 600;
                font-size: 16px;
              }
              .footer {
                margin-top: 32px;
                padding-top: 32px;
                border-top: 1px solid #e5e5e5;
                color: #737373;
                font-size: 14px;
              }
              .link {
                color: #3b82f6;
                word-break: break-all;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="card">
                <h1>Reset Your Password</h1>
                <p>You recently requested to reset your password for your IntoBrick account. Click the button below to reset it.</p>
                <p>
                  <a href="${resetUrl}" class="button">Reset Password</a>
                </p>
                <p style="margin-top: 32px;">Or copy and paste this link into your browser:</p>
                <p><a href="${resetUrl}" class="link">${resetUrl}</a></p>
                <div class="footer">
                  <p><strong>This link will expire in 1 hour.</strong></p>
                  <p>If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>
                </div>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error('Failed to send password reset email:', error);
    return { success: false, error };
  }
}

/**
 * Asks a new account to confirm its address.
 *
 * Same shape as sendPasswordResetEmail above, deliberately -- one house style
 * for transactional mail, not two. English only, matching every other template
 * here (price-alert and deals-digest are both English-only); translating this
 * one alone would be the odd one out.
 *
 * The link is built from NEXTAUTH_URL like the reset mail, rather than a
 * hard-coded host. CLAUDE.md is emphatic that one place owns the hostname.
 */
export async function sendVerificationEmail(email: string, token: string, name?: string) {
  const verifyUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/auth/verify?token=${token}`;

  const client = getResendClient();
  if (!client) {
    console.warn('Resend API key not configured - verification email not sent');
    return { success: false, error: 'Email service not configured' };
  }

  try {
    await client.emails.send({
      from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
      to: email,
      subject: 'Confirm your email - IntoBrick',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Helvetica Neue", Arial, sans-serif;
                line-height: 1.6;
                color: #171717;
                margin: 0;
                padding: 0;
                background-color: #fafafa;
              }
              .container { max-width: 560px; margin: 0 auto; padding: 32px 16px; }
              .card { background: #ffffff; border: 1px solid #e5e5e5; border-radius: 12px; padding: 32px; }
              h1 { font-size: 22px; margin: 0 0 16px; }
              .button {
                display: inline-block;
                background: #3b82f6;
                color: #ffffff !important;
                text-decoration: none;
                padding: 12px 24px;
                border-radius: 8px;
                font-weight: 600;
              }
              .link { color: #3b82f6; word-break: break-all; }
              .footer { margin-top: 32px; padding-top: 16px; border-top: 1px solid #e5e5e5; font-size: 13px; color: #737373; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="card">
                <h1>Confirm your email</h1>
                <p>${name ? `Hi ${name}, ` : ''}thanks for joining IntoBrick. Confirm this address so we can send you price alerts and get you back in if you ever forget your password.</p>
                <p><a href="${verifyUrl}" class="button">Confirm email</a></p>
                <p style="margin-top: 32px;">Or copy and paste this link into your browser:</p>
                <p><a href="${verifyUrl}" class="link">${verifyUrl}</a></p>
                <div class="footer">
                  <p><strong>This link expires in 24 hours.</strong></p>
                  <p>You can browse and build your collection without confirming. Price alerts and the daily deals email need a confirmed address, because that is where they get sent.</p>
                  <p>If you didn't create an IntoBrick account, you can ignore this email.</p>
                </div>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error('Failed to send verification email:', error);
    return { success: false, error };
  }
}

export async function sendWelcomeEmail(email: string, name: string) {
  const client = getResendClient();
  if (!client) {
    console.warn('Resend API key not configured - email not sent');
    return { success: false, error: 'Email service not configured' };
  }

  try {
    await client.emails.send({
      from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
      to: email,
      subject: 'Welcome to IntoBrick!',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Helvetica Neue", Arial, sans-serif;
                line-height: 1.6;
                color: #171717;
                margin: 0;
                padding: 0;
                background-color: #fafafa;
              }
              .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 40px 20px;
              }
              .card {
                background: #ffffff;
                border-radius: 12px;
                padding: 48px;
                box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
              }
              h1 {
                font-size: 28px;
                font-weight: 700;
                margin: 0 0 16px 0;
                color: #171717;
              }
              p {
                margin: 0 0 16px 0;
                color: #525252;
                font-size: 16px;
              }
              .button {
                display: inline-block;
                padding: 16px 32px;
                background: #3b82f6;
                color: #ffffff !important;
                text-decoration: none;
                border-radius: 8px;
                font-weight: 600;
                font-size: 16px;
                margin-top: 16px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="card">
                <h1>Welcome to IntoBrick, ${name}!</h1>
                <p>Thanks for signing up! You can now start tracking your LEGO minifigure collection with real-time Bricklink pricing.</p>
                <p>Get started by searching for your favorite minifigures and adding them to your collection.</p>
                <p>
                  <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/search" class="button">Start Searching</a>
                </p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error('Failed to send welcome email:', error);
    return { success: false, error };
  }
}
