let invoke = require('./setup');

invoke(async email => {

  let intl = {
    stringForKey: key => new Promise(resolve => setTimeout(() => {
      let strings = {
        subject: props => `Hello, ${props.name}!`,
        greeting: () => `Hello`
      };
      resolve(strings[key]);
    }, 100))
  };

  let sent = await email.send({
    to: 'ampatspell@gmail.com',
    name: 'async',
    props: {
      intl,
      name: 'Zeeba'
    },
    multipass: true
  });

  console.log(sent);
});
