const mailer = require("nodemailer");
require("dotenv/config");

module.exports = {
  sendMail: function(mailTo, mailText) {
    let body = {
      from: "antidotenepal@gmail.com",
      to: mailTo,
      subject: mailText.subject,
      html: mailText.html
    };

    const transporter = mailer.createTransport({
      service: "gmail",
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
  }
};
