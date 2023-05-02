const sgMail = require('@sendgrid/mail');
require('dotenv').config();

const { SENDGRID_API_KEY, SENDGRID_EMAIL } = process.env;

sgMail.setApiKey(SENDGRID_API_KEY);

const sendEmail = async (userEmail, verificationToken) => {
  const emailConfig = {
    from: SENDGRID_EMAIL,
    to: userEmail,
    subject: 'Email confirmation',
    html: `<a target='_blank' href='http://localhost:3000/api/users/verify/${verificationToken}'>Please, confirm email</a>`,
  };

  try {
    await sgMail.send(emailConfig);
    console.log('email was send');
    return true;
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = sendEmail;
