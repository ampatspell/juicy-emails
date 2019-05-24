# Juicy Emails 🍉

Send emails built from Handlebars templates.

* renders `handlebars` template to html (supports partials and helpers)
* uses `juice` to inline css and images
* optionally generates plain text version using `html-to-text` from html
* renders subject `handlebars` template
* sends email using `nodemailer`

``` javascript
const Email = require('juicy-emails');
const mailgun = require('nodemailer-mailgun-transport');

const path = require('path');
const templates = path.join(__dirname, 'templates');

const email = new Email({
  handlebars: {
    templates,
    helpers: require('./helpers')
  },
  juice: {
    preserveImportant: true,
    webResources: {
      // relativeTo: <defaults to handlebars.templates>
      images: 8
    }
  },
  mailer: {
    send: false, // sets transport to jsonTransport
    from: 'Zeeba <zeeba@gmail.com>', // default from
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
