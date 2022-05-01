import Email from '../lib/index.js';
import path from 'path';
import mailgun from 'nodemailer-mailgun-transport';
import helpers from './helpers/index.js';

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const root = path.join(__dirname, 'templates');

export const email = new Email({
  handlebars: {
    templates: root,
    helpers
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
