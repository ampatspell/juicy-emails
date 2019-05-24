const path = require('path');
const { readFile, glob, fileExists } = require('./file');
const Handlebars = require('handlebars');

class HandlebarsService {

  constructor(email, { templates, helpers }) {
    this.email = email;
    this.opts = {
      templates: path.resolve(templates),
      helpers
    };
  }

  get _instance() {
    let instance = this.__instance;
    if(!instance) {
      instance = Handlebars.create();
      this.__instance = instance;
    }
    return instance;
  }

  async _loadPartials() {
    let partials = path.join(this.opts.templates, 'partials');
    let files = await glob(path.join(partials, '**/*.hbs'));
    let handlebars = this._instance;
    await Promise.all(files.map(async file => {
      let { dir, name } = path.parse(path.relative(partials, file));
      let content = await readFile(file);
      name = path.join(dir, name);
      handlebars.registerPartial(name, content);
    }));
  }

  async _registerHelpers() {
    let { helpers } = this.opts;
    if(!helpers) {
      return;
    }
    let handlebars = this._instance;
    helpers = helpers(handlebars, this);
    Object.keys(helpers).forEach(key => {
      let helper = helpers[key];
      handlebars.registerHelper(key, helper);
    });
  }

  async _prepare() {
    let promise = this.__prepare;
    if(!promise) {
      promise = Promise.all([
        this._loadPartials(),
        this._registerHelpers()
      ]);
      this.__prepare = promise;
    }
    await promise;
  }

  _templateFilename(name) {
    return path.join(this.opts.templates, `${name}.hbs`);
  }

  async _compile(name) {
    let filename = this._templateFilename(name);
    try {
      let template = await readFile(filename);
      return this._instance.compile(template);
    } catch(err) {
      if(err.code === 'ENOENT') {
        let error = new Error(`Template '${name}' was not found`);
        error.filename = filename;
        error.code = 'template-not-found';
        throw error;
      }
      throw err;
    }
  }

  async exists(name) {
    let path = this._templateFilename(name);
    return await fileExists(path);
  }

  async render(name, props) {
    await this._prepare();
    let template = await this._compile(name);
    return template(props);
  }
}

module.exports = HandlebarsService;
