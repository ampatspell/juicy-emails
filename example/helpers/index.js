import t from './t.js';

export default (handlebars, service) => {
  return {
    t: t(handlebars, service)
  }
}
