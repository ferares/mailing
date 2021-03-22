const gulp       = require('gulp');
const inlineCss  = require('gulp-inline-css');
const nodemailer = require('nodemailer');
const fs         = require('fs');

const html = 'src/index.html';

function build(done) {
  gulp.src(html)
  .pipe(inlineCss())
  .pipe(gulp.dest('build/'));
  done();
};


function sendMail(config, done) {
  const nodemailerConfig = {
    host: config.host || 'smtp.ethereal.email',
    port: config.port || 587,
    secure: config.secure || false,
    auth: {
      user: config.user,
      pass: config.pass,
    },
  };

  let recipients = config.recipients || 'bar@example.com';

  const transporter = nodemailer.createTransport(nodemailerConfig);

  fs.readFile(html, 'utf8', (err, data) => {
    if (err) throw err;

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

      done();
    });
  });
}

function email(done) {
  let config = undefined;
  try {
    config = require('./config.json');
    sendMail(config, done);
  } catch (e) {
    console.log('No config file found, using Etheral test SMTP service');
    config = nodemailer.createTestAccount().then((config) => sendMail(config, done));
  }
};

exports.default = build;

exports.send = gulp.series(build, email);
