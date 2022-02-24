let { htmlToText } = require('html-to-text');
let { assign } = Object;

class TextService {

  constructor(email, opts) {
    this.opts = opts;
  }

  async render(html, opts) {
    return htmlToText(html, assign({}, this.opts, opts)).trim();
  }

}

module.exports = TextService;
