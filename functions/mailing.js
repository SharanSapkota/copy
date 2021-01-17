const mailer = require("nodemailer");
require("dotenv/config");

const SibApiV3Sdk = require("sib-api-v3-sdk");
const defaultClient = SibApiV3Sdk.ApiClient.instance;

const apiKey = defaultClient.authentications["api-key"];
apiKey.apiKey = process.env.SEND_IN_BL_API;

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

module.exports = {
  sendMail: function(mailTo, mailText) {
    let body = {
      from: "antidotenepal@gmail.com",
      to: mailTo,
      subject: mailText.subject,
      html: mailText.html
    };

    // const transporter = mailer.createTransport({
    //   service: "gmail",
    //   auth: {
    //     user: process.env.EMAIL_USER,
    //     pass: process.env.EMAIL_PASS
    //   }
    // });

    let transporter = mailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // use SSL
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // verify connection configuration
    transporter.verify(function(error, success) {
      if (error) {
        console.log(error);
      } else {
        console.log("Server is ready to take our messages");
      }
    });

    transporter.sendMail(body, (err, result) => {
      if (err) {
        console.log(err);
        return false;
      }
      console.log(result);
      console.log("email sent");
    });
  },

  sendMailNew: function(mailTo, mailText) {
    let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

    sendSmtpEmail.subject = mailText.subject;
    sendSmtpEmail.htmlContent = mailText.html;
    sendSmtpEmail.sender = {
      name: "Antidote Go",
      email: "info@antidotenepal.com"
    };
    sendSmtpEmail.to = [{ email: mailTo }];
    sendSmtpEmail.replyTo = {
      email: "info@antidotenepal.com",
      name: "Antidote Go"
    };

    apiInstance.sendTransacEmail(sendSmtpEmail).then(
      function(data) {
        console.log(
          "API called successfully. Returned data: " + JSON.stringify(data)
        );
      },
      function(error) {
        console.error(error);
      }
    );
  }
};
