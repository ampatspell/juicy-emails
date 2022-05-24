import juice from 'juice';

export default class JuiceService {

  constructor(email, opts) {
    this.opts = opts;
  }

  render(html) {
    let { opts } = this;
    return new Promise((resolve, reject) => juice.juiceResources(html, opts, (err, html) => {
      if (err) {
        return reject(err);
      }
      resolve(html);
    }));
  }

}
