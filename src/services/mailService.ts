import mailgun from 'mailgun-js';

export async function sendJudgeInvitation(email, inviteUrl) {
  const mg = mailgun({
    apiKey: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN
  });

  const data = {
    from: `Contest Admin <noreply@${process.env.MAILGUN_DOMAIN}>`,
    to: email,
    subject: 'Invitation to Judge Contest',
    html: `
      <h2>You've been invited to judge our art contest!</h2>
      <p>Hello,</p>
      <p>You have been selected to be a judge for our art contest. We value your expertise and would appreciate your participation.</p>
      <p>Please click the button below to accept the invitation and set up your account:</p>
      <p>
        <a href="${inviteUrl}" style="display: inline-block; background-color: #DB2777; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
          Accept Invitation
        </a>
      </p>
      <p>If you're unable to click the button, copy and paste this URL into your browser:</p>
      <p>${inviteUrl}</p>
      <p>Thank you,<br>Contest Admin Team</p>
    `
  };

  return new Promise((resolve, reject) => {
    mg.messages().send(data, (error, body) => {
      if (error) {
        reject(error);
      } else {
        resolve(body);
      }
    });
  });
}
