export default () => {

  return (key, props) => {
    let { hash, data: { root: { multipass, intl } } } = props;

    if(!multipass.t) {
      multipass.t = Object.create(null);
    }

    let string = multipass.t[key];
    if(!string) {
      let promise = intl.stringForKey(key).then(string => {
        multipass.t[key] = string;
      });
      multipass.promises.push(promise);
      return;
    }

    return string(hash);
  };
}
