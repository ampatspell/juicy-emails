let invoke = require('./setup');

invoke(async email => {

  let sent = await email.send({
    to: 'zeeba@gmail.com',
    name: 'hello',
    props: {
      name: 'Zeeba'
    }
  });

  console.log(sent);
});
