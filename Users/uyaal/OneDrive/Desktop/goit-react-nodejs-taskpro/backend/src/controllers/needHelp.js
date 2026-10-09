import { sendEmail } from '../utils/sendMail.js';
import { SUPPORT_EMAIL } from '../constants/index.js';
import { env } from '../utils/env.js';
import { SMTP } from '../constants/index.js';

export const sendHelpRequest = async (req, res) => {
  const { fromEmail, fromName, message } = req.body;

  if (!fromEmail || !message) {
    return res.status(400).json({ message: 'Email and message are required.' });
  }

  try {
    await sendEmail({
      from: env(SMTP.SMTP_FROM) || env(SMTP.SMTP_USER),
      to: SUPPORT_EMAIL,
      replyTo: fromEmail,
      subject: `TaskPro Support Request from ${fromName || fromEmail}`,
      text: `TaskPro Support Request
            From: ${fromName || 'N/A'}
            Email: ${fromEmail}

            Message: ${message}`,
      html: `
        <p><strong>From:</strong> ${fromName || 'N/A'} (${fromEmail})</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    });

    res.status(200).json({ message: 'Your message has been sent!' });
  } catch (err) {
        console.error('Error sending help email:', err);
        res.status(500).json({ message: 'Failed to send message.' });
  }
};
