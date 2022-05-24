import path from 'path';
import { readFile, readFileSync, glob, fileExists } from './file.js';
import Handlebars from 'handlebars';
import { componentHelper, yieldHelper, hasBlockHelper } from './handlebars/component.js';
import { hashHelper, concatHelper } from './handlebars/helpers.js';

export default class HandlebarsService {

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
    let handlebars = this._instance;
    let { helpers } = this.opts;
    handlebars.registerHelper('component', componentHelper(handlebars, this));
    handlebars.registerHelper('yield', yieldHelper(handlebars, this));
    handlebars.registerHelper('has-block', hasBlockHelper(handlebars, this));
    handlebars.registerHelper('hash', hashHelper(handlebars, this));
    handlebars.registerHelper('concat', concatHelper(handlebars, this));
    if(helpers) {
      helpers = helpers(handlebars, this);
      Object.keys(helpers).forEach(key => {
        let helper = helpers[key];
        handlebars.registerHelper(key, helper);
      });
    }
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

  _compile(name) {
    let filename = this._templateFilename(name);
    try {
      let template = readFileSync(filename, 'utf-8');
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

  _render(name, props) {
    let template = this._compile(name);
    return template(props);
  }

  async render(name, props) {
    await this._prepare();
    return this._render(name, props);
  }
}
