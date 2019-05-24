let htmlToText = require('html-to-text');

class TextService {

  constructor(email, opts) {
    this.opts = opts;
  }

  async render(html) {
    return htmlToText.fromString(html, this.opts).trim();
  }

}

module.exports = TextService;
