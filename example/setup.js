const Email = require('../lib');
const path = require('path');
const mailgun = require('nodemailer-mailgun-transport');

let root = path.join(__dirname, 'templates');

let email = new Email({
  handlebars: {
    templates: root,
    helpers: require('./helpers')
  },
  juice: {
    preserveImportant: true,
    webResources: {
      images: 8
    }
  },
  mailer: {
    send: true,
    from: 'ampatspell@gmail.com',
    transport: mailgun({
      auth: {
        api_key: '…',
        domain: '…'
      },
      host: 'api.eu.mailgun.net'
    })
  }
});

module.exports = fn => {
  fn(email).then(res => {
    if(res) {
      console.log(res);
    }
  }, err => {
    console.error(err);
  });
}
