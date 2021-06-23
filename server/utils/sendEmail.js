import nodemailer from 'nodemailer';
import colors from 'colors';
import dotenv from 'dotenv';
import sgMail from '@sendgrid/mail';
dotenv.config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendMessage = ({ to, text, subject, templateId, data }, callback) => {
  // let transporter = nodemailer.createTransport({
  //   host: 'smtp.sendgrid.net',
  //   port: 465,
  //   secure: true, // use TLS
  //   auth: {
  //     user: 'apikey',
  //     pass: process.env.SENDGRID_API_KEY
  //   },
  //   tls: {
  //     // do not fail on invalid certs
  //     rejectUnauthorized: false
  //   }
  // });
  // const mailOptions = {
  //   to,
  //   from: process.env.SMTP_EMAIL,
  //   subject,
  //   text
  // };
  // transporter.sendMail(mailOptions, callback);

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
