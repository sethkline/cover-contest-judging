import mailgun from "mailgun-js";

export async function sendJudgeInvitation(email, inviteUrl) {
  const mg = mailgun({
    apiKey: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN,
  });

  // Get the app URL from environment variable
  const appUrl = (
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  ).replace(/\/$/, "");

  // If the invite URL contains a redirect to a different domain than our app URL
  // then we should fix it to use our expected app URL with the callback path
  let fixedInviteUrl = inviteUrl;
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
    const callbackPath = "/callback?next=/confirm-judge";
    const newRedirectTo = `${appUrl}${callbackPath}`;

    fixedInviteUrl = `${baseAuthUrl}?token=${token}&type=${type}&redirect_to=${encodeURIComponent(newRedirectTo)}`;
    console.log("Modified invite URL to use environment URL:", fixedInviteUrl);
  }

  const data = {
    from: `Contest Admin <noreply@${process.env.MAILGUN_DOMAIN}>`,
    to: email,
    subject: "Invitation to Judge Contest",
    html: `
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
      <p>Thank you,<br>Contest Admin Team</p>
    `,
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
