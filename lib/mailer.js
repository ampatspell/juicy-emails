import nodemailer from 'nodemailer';

const normalizeTransport = (transport, send) => {
  if(send === false) {
    transport = {
      jsonTransport: true
    };
  }

  if(typeof transport.sendMail !== 'function') {
    transport = nodemailer.createTransport(transport);
  }

  return transport;
}

export default class MailerService {

  constructor(email, { transport, send, from }) {
    this.transport = normalizeTransport(transport, send);
    this.from = from;
  }

  // { from, to, subject, text, html }
  async send(message) {
    message.from = message.from || this.from;
    let response = await this.transport.sendMail(message);
    response.source = message;
    return response;
  }

}
