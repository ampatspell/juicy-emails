import { email } from './setup.js';

let sent = await email.send({
  to: 'ampatspell@gmail.com',
  name: 'hello',
  props: {
    name: 'Zeeba'
  }
});

console.log(sent.source.html);
