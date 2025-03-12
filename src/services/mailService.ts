import mailgun from "mailgun-js";

// Helper function to fix redirect URLs
function fixRedirectUrl(inviteUrl, appUrl, callbackPath) {
  let fixedUrl = inviteUrl;
  if (
    inviteUrl.includes("redirect_to=") &&
    !inviteUrl.includes(`redirect_to=${appUrl}`)
  ) {
    // Extract the token and other parameters from the original URL
    const url = new URL(inviteUrl);
    const token = url.searchParams.get("token");
    const type = url.searchParams.get("type");

    // Build a new URL with the correct redirect parameters
    const baseAuthUrl = url.origin + url.pathname;
    const newRedirectTo = `${appUrl}${callbackPath}`;

    fixedUrl = `${baseAuthUrl}?token=${token}&type=${type}&redirect_to=${encodeURIComponent(newRedirectTo)}`;
    console.log("Modified URL to use environment URL:", fixedUrl);
  }
  return fixedUrl;
}

// Send an email using Mailgun
async function sendEmail(email, subject, htmlContent) {
  const mg = mailgun({
    apiKey: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN,
  });

  const data = {
    from: `Contest Admin <noreply@${process.env.MAILGUN_DOMAIN}>`,
    to: email,
    subject: subject,
    html: htmlContent,
  };

  return new Promise((resolve, reject) => {
    mg.messages().send(data, (error, body) => {
      if (error) {
        console.error("Failed to send email:", error);
        reject(error);
      } else {
        console.log("Email sent successfully:", body);
        resolve(body);
      }
    });
  });
}

//judge invitation
export async function sendJudgeInvitation(email, inviteUrl) {
  // Get the app URL from environment variable
  const appUrl = (
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  ).replace(/\/$/, "");

  const callbackPath = "/callback?next=/judge/dashboard";
  const fixedInviteUrl = fixRedirectUrl(inviteUrl, appUrl, callbackPath);

  const htmlContent = `
    <h2>You've been invited to judge our art contest!</h2>
    <p>Hello,</p>
    <p>You have been selected to be a judge for our art contest. We value your expertise and would appreciate your participation.</p>
    <p>Please click the button below to accept the invitation and set up your account:</p>
    <p>
      <a href="${fixedInviteUrl}" style="display: inline-block; background-color: #DB2777; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
        Accept Invitation
      </a>
    </p>
    <p>If you're unable to click the button, copy and paste this URL into your browser:</p>
    <p>${fixedInviteUrl}</p>
    <p><strong>Having issues with the link?</strong> If your email security system blocks the link, you can go to <a href="${appUrl}/judge-access">${appUrl}/judge-access</a> and request an access code instead.</p>
    <p>Thank you,<br>Contest Admin Team</p>
  `;

  return sendEmail(email, "Invitation to Judge Contest", htmlContent);
}

// Reinvite a judge whose link expired
export async function sendJudgeReinvitation(email, inviteUrl) {
  // Get the app URL from environment variable
  const appUrl = (
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  ).replace(/\/$/, "");

  const callbackPath = "/callback?next=/confirm-judge";
  const fixedInviteUrl = fixRedirectUrl(inviteUrl, appUrl, callbackPath);

  const htmlContent = `
    <h2>Your Judge Invitation Has Been Renewed</h2>
    <p>Hello,</p>
    <p>Your previous invitation link has expired or was invalid. We've created a new invitation link for you to join as a judge for our art contest.</p>
    <p>Please click the button below to accept the invitation and set up your account:</p>
    <p>
      <a href="${fixedInviteUrl}" style="display: inline-block; background-color: #DB2777; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
        Accept New Invitation
      </a>
    </p>
    <p>If you're unable to click the button, copy and paste this URL into your browser:</p>
    <p>${fixedInviteUrl}</p>
    <p>This link will expire in 24 hours for security reasons.</p>
    <p>Thank you,<br>Contest Admin Team</p>
  `;

  return sendEmail(
    email,
    "Your Judge Invitation Has Been Renewed",
    htmlContent,
  );
}

// Send password reset email
export async function sendPasswordReset(email, resetUrl) {
  // Get the app URL from environment variable
  const appUrl = (
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  ).replace(/\/$/, "");

  const callbackPath = "/callback?next=/reset-password";
  const fixedResetUrl = fixRedirectUrl(resetUrl, appUrl, callbackPath);

  const htmlContent = `
    <h2>Reset Your Password</h2>
    <p>Hello,</p>
    <p>We received a request to reset your password for the art contest judging platform.</p>
    <p>Please click the button below to set a new password:</p>
    <p>
      <a href="${fixedResetUrl}" style="display: inline-block; background-color: #DB2777; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
        Reset Password
      </a>
    </p>
    <p>If you're unable to click the button, copy and paste this URL into your browser:</p>
    <p>${fixedResetUrl}</p>
    <p>This link will expire in 24 hours for security reasons.</p>
    <p>If you didn't request a password reset, you can ignore this email.</p>
    <p>Thank you,<br>Contest Admin Team</p>
  `;

  return sendEmail(email, "Reset Your Password", htmlContent);
}

// Send magic link for passwordless login
export async function sendMagicLink(email, magicUrl) {
  // Get the app URL from environment variable
  const appUrl = (
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  ).replace(/\/$/, "");

  const callbackPath = "/callback?next=/judge/dashboard";
  const fixedMagicUrl = fixRedirectUrl(magicUrl, appUrl, callbackPath);

  const htmlContent = `
    <h2>Your Login Link</h2>
    <p>Hello,</p>
    <p>Here's your secure login link for the art contest judging platform:</p>
    <p>
      <a href="${fixedMagicUrl}" style="display: inline-block; background-color: #DB2777; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
        Log In Now
      </a>
    </p>
    <p>If you're unable to click the button, copy and paste this URL into your browser:</p>
    <p>${fixedMagicUrl}</p>
    <p>This link will expire in 24 hours for security reasons.</p>
    <p>If you didn't request this login link, you can ignore this email.</p>
    <p>Thank you,<br>Contest Admin Team</p>
  `;

  return sendEmail(email, "Your Login Link", htmlContent);
}

// Add this to your existing mailService file

export async function sendOtpEmail(email: string, otp: string) {
  const mg = mailgun({
    apiKey: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN,
  });

  const htmlContent = `
    <h2>Your Access Code</h2>
    <p>Hello,</p>
    <p>Here is your one-time access code for the judging platform:</p>
    <div style="margin: 20px 0; padding: 15px; background-color: #f5f5f5; border-radius: 5px; text-align: center; font-size: 24px; letter-spacing: 5px; font-weight: bold;">
      ${otp}
    </div>
    <p>This code will expire in 10 minutes for security reasons.</p>
    <p>If you didn't request this code, you can safely ignore this email.</p>
    <p>Thank you,<br>Contest Admin Team</p>
  `;

  const data = {
    from: `Contest Admin <noreply@${process.env.MAILGUN_DOMAIN}>`,
    to: email,
    subject: "Your Access Code for the Judging Platform",
    html: htmlContent,
  };

  return new Promise((resolve, reject) => {
    mg.messages().send(data, (error, body) => {
      if (error) {
        console.error("Failed to send OTP email:", error);
        reject(error);
      } else {
        console.log("OTP email sent successfully:", body);
        resolve(body);
      }
    });
  });
}
