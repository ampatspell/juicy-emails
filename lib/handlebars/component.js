import assert from 'assert';

const {
  assign
} = Object;

class ComponentInvocation {

  constructor(name, options, Handlebars, instance) {
    this.name = name;
    this.options = options;
    this.Handlebars = Handlebars;
    this.instance = instance;
  }

  hasBlock() {
    return !!this.options.fn;
  }

  safeString(html) {
    if(html.trim) {
      html = html.trim();
    }
    return new this.Handlebars.SafeString(html);
  }

  render() {
    let { instance, name, options } = this;
    let html = instance._render(name, assign({}, options.hash, { _component: this }));
    return this.safeString(html);
  }

  yield(args) {
    let { options: { fn }, options } = this;
    if(!fn) {
      return '';
    }
    let html = fn(assign({}, options.data.root, options.hash), { blockParams: args });
    return this.safeString(html);
  }

}

const getComponentInvocation = options => options.data.root._component;

export const componentHelper = (Handlebars, instance) => (...args) => {
  assert(args.length === 2, `component requires exactly one argument`);
  let [ name, options ] = args;
  let component = new ComponentInvocation(name, options, Handlebars, instance);
  return component.render();
};

export const hasBlockHelper = () => (...args) => {
  let options = args.pop();
  let component = getComponentInvocation(options);
  return component?.hasBlock();
};

export const yieldHelper = () => (...args) => {
  let options = args.pop();
  let component = getComponentInvocation(options);
  return component.yield(args);
};
