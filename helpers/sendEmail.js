const mailgun = require("mailgun-js");
const mg = mailgun({apiKey: process.env.MAIL_GUN_API_KEY, domain: process.env.MAIN_GUN_DOMAIN});
const ejs = require('ejs');
const path = require("path");
const fs = require("fs");


const sendEmail = (email, url) => {
  return new Promise((resolve, reject) => {
    const data = {
      from: `Excited User <me@${process.env.MAIN_GUN_DOMAIN}>`,
      to: email,
      subject: 'Reset password',
      html: ejs.render(
        fs.readFileSync(path.resolve(__dirname, './email-template.html')).toString(),
        {
          url
        }
      )
    };
    mg.messages().send(data, function (error, body) {
      if (error) {
        return reject(error);
      }
      resolve(body)
    });
  });
}

module.exports = {
  sendEmail
}
