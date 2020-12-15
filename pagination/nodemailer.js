const nodemailer = require("nodemailer");
require("dotenv/config");

const SendMail = (mailto, mailText) => {

  let transporter = nodemailer.createTransport({
    host: "smtp.zoho.com",
    port: 465,
    secure: true, // use SSL
    auth: {
      user: "info@antidotenepal.com",
      pass: "mWeRrb8QcyTE"
    }
  });

  var mailOptions = {
    from: "info@antidotenepal.com",
    to: mailto,
    subject: mailText.subject,
    html: mailText.html
  };

  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log(error);
    } else {
      res.status(200).send({ success: true, msg: "Mail sent." });
    }
  });

};

module.exports = SendMail;
