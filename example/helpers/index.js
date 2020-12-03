module.exports = (handlebars, service) => {
  let helper = name => require(`./${name}`)(handlebars, service);
  return {
    t: helper('t')
  };
}
