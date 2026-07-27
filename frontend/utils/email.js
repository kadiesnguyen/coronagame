const nodemailer = require("nodemailer");
const sgTransport = require("nodemailer-sendgrid-transport");
const sendEmail = async (options) => {
  // const transporter = nodemailer.createTransport({
  //   service: "gmail",
  //   host: "smtp.gmail.com",
  //   port: 587,
  //   auth: {
  //     // type: "OAuth2",

  //     user: process.env.ACCOUNT_GMAIL,
  //     pass: process.env.PASSWORD_GMAIL,
  //     // clientId: process.env.OAUTH_CLIENTID,
  //     // clientSecret: process.env.OAUTH_CLIENT_SECRET,
  //     // refreshToken: process.env.OAUTH_REFRESH_TOKEN,
  //   },
  // });
  // Gmail only//

  // // mailtrap//
  // const transport = nodemailer.createTransport({
  //   host: "smtp.mailtrap.io",
  //   port: 2525,
  //   secure: false,
  //   auth: {
  //     user: "432135c49509cc",
  //     pass: "0d817140417654",
  //   },
  // });

  //SENDGRID
  const transport = nodemailer.createTransport(
    sgTransport({
      auth: {
        api_key: process.env.SENDGRID_APIKEY,
      },
    })
  );
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: options.email,
    subject: options.subject,
    text: options.text,
    html: options.message,
  };

  await transport.sendMail(mailOptions);
};
module.exports = sendEmail;
