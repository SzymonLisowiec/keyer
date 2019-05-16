const Dialects = require(`${__dirname}/dialects`);
const { EventEmitter } = require('events');

class Main extends EventEmitter {

  constructor(config) {
    super();

    this.config = {
      host: '127.0.0.1',
      ...config
    };
    this.dialect = null;
    this.methods = [

      /**
       * Internal
       */
      'validateConfig',

      /**
       * Basic
       */
      'connect',
      'disconnect',
      'get',
      'set',
      'del',
      'flush',
      'exists',

      /**
       * Lists
       */
      'listAppend',
      'listPrepend',
      'listPop',
      'listShift',
      'listLength',
      'listSetIndex',
      'listGetIndex',
      'listGetRange',
      'listGetFull',

    ];

    this.selectDialect();
    this.generateMethods();
    this.validateConfig();

  }

  static registerDialect(dialect) {
    Dialects[dialect.name.toLowerCase()] = dialect;
  }

  selectDialect() {
    if (!this.config.dialect) throw new Error('No dialect selected.');
    this.config.dialect = this.config.dialect.toLowerCase();
    if (typeof Dialects[this.config.dialect] === 'undefined') {
      const supportedDialects = implode(', ', Object.keys(Dialects));
      throw new Error(`Unsupported dialect "${this.config.dialect}". Please select one of supported dialects: ${supportedDialects}`);
    }
    this.dialect = new Dialects[this.config.dialect](this);
  }

  async do(method, ...args) {
    if (typeof this.dialect[method] !== 'function') throw new Error(`Unsupported method ${method}() by ${this.dialect.name}.`);
    return await this.dialect[method](...args);
  }

  generateMethods() {
    this.methods.forEach((method) => {
      this[method] = (...args) => this.do(method, ...args);
    });
  }

  checkSupport() {
    const methods = {};
    this.methods.forEach((method) => {
      methods[method] = typeof this.dialect[method] === 'function';
    });
    return methods;
  }

}

module.exports = Main;
