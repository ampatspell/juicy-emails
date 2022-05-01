import { email } from './setup.js';

try {
  let sent = await email.send({
    to: 'ampatspell@gmail.com',
    name: 'hello',
    props: {
      name: 'Zeeba'
    }
  });
  console.log(sent);
} catch(err) {
  console.log(err);
}
