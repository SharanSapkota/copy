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
//   let transporter = nodemailer.createTransport({
//   service: "gmail",
//     secure: true, // use SSL
//     auth: {
//       xoauth2: xoauth2.createXOAuth2Generator({
//         user: 'sapkotarambbo@gmail.com',
//         ClientId: '622474237468-98up7n2vrceb308ke2heq1lg3u64lo3p.apps.googleusercontent.com',
//         ClientSecret: '8XdWss59D57MtJTT1ZVhm_6l',
//         refreshToken: ''
//       })
//     }
//   });

//   transporter.set('oauth2_provision_cb', (user, renew, callback)=>{
//     let accessToken = userTokens[user];
//     if(!accessToken){
//         return callback(new Error('Unknown user'));
//     }else{
//         return callback(null, accessToken);
//     }
// });

  var mailOptions = {
    from: "sapkotarambbo@gmail.com",
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
