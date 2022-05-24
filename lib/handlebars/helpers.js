export const hashHelper = () => (...args) => {
  let { hash } = args.pop();
  return hash || {};
};

export const concatHelper = () => (...args) => {
  let options = args.pop();
  let separator = options.hash.separator || '';
  return args.join(separator);
};
