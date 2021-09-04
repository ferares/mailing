const nodemailer = require('nodemailer');
const inlineCss = require('inline-css');
const fs = require('fs');

let config = '';
try {
  config = require('./config.json');
} catch (e) {
  config = false;
}

function sendMail(config) {

  fs.readFile('./src/index.html', 'utf8', (err, html) => {
    if (err) throw err;

    inlineCss(html, { url: `file://${__dirname}/src/` }).then((data) => {
      const nodemailerConfig = {
        host: config.host || 'smtp.ethereal.email',
        port: config.port || 587,
        secure: config.secure || false,
        auth: {
          user: config.user,
          pass: config.pass,
        },
      };

      const recipients = config.recipients || 'bar@example.com';
      const transporter = nodemailer.createTransport(nodemailerConfig);
      transporter.sendMail({
        from: config.from || '"Mailing tester" <noreply@mailing.test>',
        to: recipients,
        subject: config.subject || 'Mailing test',
        text: 'You need an HTML compatible email client to read this email',
        html: data,
      }).then((info) => {
        console.log('Message sent');
        url = nodemailer.getTestMessageUrl(info);
        if (url) {
          console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        }
      });
    });

  });
}

async function email() {
  let config;
  try {
    config = require('./config.json');
  } catch (e) {
    console.log('No config file found, using Etheral test SMTP service');
    config = await nodemailer.createTestAccount();
  }

  sendMail(config);
};

email();
