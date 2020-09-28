


    const nodemailer = require('nodemailer')
    require('dotenv/config')

  const mailing = (mailto, mailText) => { 
      console.log(mailto,mailText)
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
     service: 'gmail',
      auth: {
        user: 'sapkotarambbo@gmail.com', // generated ethereal user
        pass: process.env.PASS // generated ethereal password
      },
    });

    // const mailingObject 

  
    // send mail with defined transport object
    let info =  transporter.sendMail({
      from: 'sapkotarambbo@gmail.com', // sender address
      to: 'antidotenepal@gmail.com', // list of receivers
      subject: mailText.subject, // Subject line
      
      html: mailText.message, // html body

      

    });
  
transporter.sendMail(info, function(err, mail){
    if(err) {
        console.log(err)
    }
    else{
        console.log(response.mail)
        res.json('email has been sent')
    }
})
}

module.exports = mailing
  
    







//     const nodemailer = require('nodemailer')
//     require('dotenv/config')

//   const mailing = () => { 
//     // create reusable transporter object using the default SMTP transport
//     let transporter = nodemailer.createTransport({
//      service: 'gmail',
//       auth: {
//         user: 'sapkotarambbo@gmail.com', // generated ethereal user
//         pass: process.env.PASS // generated ethereal password
//       },
//     });
  
//     // send mail with defined transport object
//     let info =  transporter.sendMail({
//       from: 'sapkotarambbo@gmail.com', // sender address
//       to: "sapkotasharan77@gmail.com", // list of receivers
//       subject: "Dear ", // Subject line
      
//       html: "<h1>thankyou for using our service</h1>", // html body

//       from: 'sapkotarambbo@gmail.com', // sender address
//       to: "sapkotarambbo007@gmail.com", // list of receivers
//       subject: "Dear sapkota ji ", // Subject line
      
//       html: "<h1>thankyou for using our service sapkota</h1>", // html body

//       from: 'sapkotarambbo@gmail.com', // sender address
//       to: "sapkotarambbo@gmail.com", // list of receivers
//       subject: "About order", // Subject line
      
//       html: "We have a new order", // html body
//     });
  
// transporter.sendMail(info, function(err, mail){
//     if(err) {
//         console.log(err)
//     }
//     else{
//         console.log(response.mail)
//         res.json('email has been sent')
//     }
// })
// }

// module.exports = mailing
  
    
