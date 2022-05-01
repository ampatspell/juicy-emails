import { htmlToText } from 'html-to-text';

const {
  assign
} = Object;

export default class TextService {

  constructor(email, opts) {
    this.opts = opts;
  }

  async render(html, opts) {
    return htmlToText(html, assign({}, this.opts, opts)).trim();
  }

}
