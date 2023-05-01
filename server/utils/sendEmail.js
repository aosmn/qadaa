import dotenv from 'dotenv';
import sgMail from '@sendgrid/mail';
dotenv.config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendMessage = ({ to, text, subject, templateId, data }) => {
  const msg = {
    to,
    from: process.env.SMTP_EMAIL
  };
  if (text) {
    msg.text = text;
    msg.subject = subject;
  }
  if (templateId) {
    msg.templateId = templateId;
    msg.dynamic_template_data = data;
  }
  return sgMail.send(msg);
};

export default sendMessage;
