# Juicy Emails 🍉

Send emails built from Handlebars templates.

* renders [handlebars](https://github.com/wycats/handlebars.js) template to html (supports partials and helpers)
* uses [juice](https://github.com/Automattic/juice) to inline css and images
* optionally generates plain text version using [html-to-text](https://github.com/werk85/node-html-to-text) from html
* renders subject [handlebars](https://github.com/wycats/handlebars.js) template
* sends email using [nodemailer](https://github.com/nodemailer/nodemailer)

``` javascript
import JuicyEmails from 'juicy-emails';
import mailgun from 'nodemailer-mailgun-transport';
import path from 'path';

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const templates = path.join(__dirname, 'templates');

const email = new JuicyEmails({
  handlebars: {
    templates, // required
    helpers    // optional
  },
  juice: {
    preserveImportant: true,
    webResources: {
      // relativeTo: <defaults to handlebars.templates>
      images: 8
    }
  },
  mailer: {
    send: false, // sets transport to jsonTransport, defaults to true
    from: 'Zeeba <zeeba@gmail.com>', // default from, optional
    transport: mailgun({ // defaults to { jsonTransport: true }
      auth: {
        api_key: '...',
        domain: '...'
      }
    })
  }
});

let res = await email.send({
  from, // defaults to mailer.from
  to: 'larry@gmail.com',
  name: 'hello',
  props: {
    name: 'Larry',
  }
});
```

```
templates
├── hello          -- email name `email.send({ name, ... })`
|  ├── html.hbs    -- html template (required)
|  ├── subject.hbs -- subject line (required)
|  └── text.hbs    -- plain text template (optional)
├── partials       -- handlebars partials
|  └── body.hbs
└── style.css
```

Heavily influenced by [email-templates](https://github.com/niftylettuce/email-templates). Thank you [@niftylettuce](https://github.com/niftylettuce)
