const HandlebarsService = require('./handlebars');
const JuiceService = require('./juice');
const TextService = require('./text');
const MailerService = require('./mailer');

const {
  assign
} = Object;

const normalizeOptions = ({ handlebars, juice, text, mailer }) => {
  handlebars = assign({}, handlebars);
  let { templates: root } = handlebars;
  juice = assign({ webResources: {} }, juice);
  juice.webResources = assign({ relativeTo: root }, juice.webResources);
  text = assign({}, text);
  mailer = assign({ transport: { jsonTransport: true } }, mailer);
  return { handlebars, juice, text, mailer };
};

class EmailService {

  constructor(opts) {
    let { handlebars, juice, text, mailer } = normalizeOptions(opts);
    this.handlebars = new HandlebarsService(this, handlebars);
    this.juice = new JuiceService(this, juice);
    this.text = new TextService(this, text);
    this.mailer = new MailerService(this, mailer);
  }

  async renderHTML(name, props) {
    let fullName = `${name}/html`;
    let html = await this.handlebars.render(fullName, props);
    return await this.juice.render(html);
  }

  async _renderText(fullName, props) {
    let html = await this.handlebars.render(fullName, props);
    return await this.text.render(html);
  }

  async renderSubject(name, props) {
    let fullName = `${name}/subject`;
    return await this._renderText(fullName, props);
  }

  async renderText(name, props) {
    let fullName = `${name}/text`;
    let exists = await this.handlebars.exists(fullName);
    if(!exists) {
      return;
    }
    return await this._renderText(fullName, props);
  }

  async _render({ name, props }) {
    let [ html, text, subject ] = await Promise.all([
      this.renderHTML(name, props),
      this.renderText(name, props),
      this.renderSubject(name, props)
    ]);

    if(!text) {
      text = await this.text.render(html);
    }

    return {
      subject,
      html,
      text
    };
  }

  async render({ name, props, multipass }) {
    if(multipass) {
      props = assign({ multipass: { promises: [] } }, props);
      await this._render({ name, props });
      await Promise.all(props.multipass.promises);
    }
    return await this._render({ name, props });
  }

  async send(opts) {
    let { name, props, multipass } = opts;
    let { subject, html, text } = await this.render({ name, props, multipass });
    opts = assign({}, opts, { subject, html, text });
    return await this.mailer.send(opts);
  }

}

module.exports = EmailService;
