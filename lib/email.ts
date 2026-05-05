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
      subject: 'Reset Your Password - Minifig Price Tracker',
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
                <p>You recently requested to reset your password for your Minifig Price Tracker account. Click the button below to reset it.</p>
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
      subject: 'Welcome to Minifig Price Tracker!',
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
                <h1>Welcome to Minifig Price Tracker, ${name}!</h1>
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

export async function sendNewsletterConfirmationEmail(email: string, token: string) {
  const confirmUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/newsletter/confirm?token=${token}`;

  const client = getResendClient();
  if (!client) {
    console.warn('Resend API key not configured - email not sent');
    return { success: false, error: 'Email service not configured' };
  }

  try {
    await client.emails.send({
      from: process.env.EMAIL_FROM || 'FigTracker <hello@figtracker.ericksu.com>',
      to: email,
      subject: 'Confirm Your FigTracker Newsletter Subscription',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
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
                background: linear-gradient(135deg, #005C97 0%, #363795 100%);
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
            </style>
          </head>
          <body>
            <div class="container">
              <div class="card">
                <h1>Confirm Your Subscription</h1>
                <p>Thanks for subscribing to FigTracker updates! Click the button below to confirm your email address and choose which notifications you'd like to receive.</p>
                <p>
                  <a href="${confirmUrl}" class="button">Confirm Subscription</a>
                </p>
                <div class="footer">
                  <p>If you didn't subscribe to FigTracker, you can safely ignore this email.</p>
                </div>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error('Failed to send newsletter confirmation email:', error);
    return { success: false, error };
  }
}

export async function sendNewsletterWelcomeEmail(email: string) {
  const client = getResendClient();
  if (!client) {
    console.warn('Resend API key not configured - email not sent');
    return { success: false, error: 'Email service not configured' };
  }

  try {
    await client.emails.send({
      from: process.env.EMAIL_FROM || 'FigTracker <hello@figtracker.ericksu.com>',
      to: email,
      subject: 'Welcome to FigTracker Updates!',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
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
                background: linear-gradient(135deg, #005C97 0%, #363795 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
              }
              p {
                margin: 0 0 16px 0;
                color: #525252;
                font-size: 16px;
              }
              .features {
                margin: 24px 0;
              }
              .feature {
                margin-bottom: 12px;
              }
              .button {
                display: inline-block;
                padding: 16px 32px;
                background: linear-gradient(135deg, #005C97 0%, #363795 100%);
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
                <h1>You're All Set! 🎉</h1>
                <p>Welcome to the FigTracker community! You'll now receive:</p>
                <div class="features">
                  <div class="feature">📦 <strong>Product Updates</strong> - New features and improvements</div>
                  <div class="feature">💰 <strong>LEGO Deals</strong> - Special offers and sales alerts</div>
                  <div class="feature">📊 <strong>Weekly Digest</strong> - Market trends and highlights</div>
                </div>
                <p>You can manage your preferences anytime from the link at the bottom of our emails.</p>
                <p>
                  <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}" class="button">Visit FigTracker</a>
                </p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error('Failed to send newsletter welcome email:', error);
    return { success: false, error };
  }
}

export async function sendUnsubscribeConfirmationEmail(email: string) {
  const client = getResendClient();
  if (!client) {
    console.warn('Resend API key not configured - email not sent');
    return { success: false, error: 'Email service not configured' };
  }

  try {
    await client.emails.send({
      from: process.env.EMAIL_FROM || 'FigTracker <hello@figtracker.ericksu.com>',
      to: email,
      subject: 'You've Been Unsubscribed from FigTracker',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
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
                <h1>You've Been Unsubscribed</h1>
                <p>We're sorry to see you go! You've been successfully unsubscribed from FigTracker email updates.</p>
                <p>You won't receive any more newsletters from us.</p>
                <p>If you change your mind, you can always resubscribe from our website.</p>
                <p>
                  <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}" class="button">Visit FigTracker</a>
                </p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error('Failed to send unsubscribe confirmation email:', error);
    return { success: false, error };
  }
}
