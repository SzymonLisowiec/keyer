const Memcached = require('memcached');

class MemcachedDialect {

  constructor(client) {
    this.name = 'memcached';
    this.client = client;
    this.config = this.client.config;
    this.connection = null;
  }

  validateConfig() {
    if (!this.config.server) {
      if (this.config.host && this.config.port) this.config.server = `${this.config.host}:${this.config.port}`;
      else this.config.server = '127.0.0.1:11211';
    }
  }

  connect() {
    return new Promise((resolve) => {

      this.connection = new Memcached(this.config.server, this.config);

      const onError = (err) => {
        this.client.emit('error', err);
      };

      const onWarning = (err) => {
        this.client.emit('warning', err);
      };

      this.connection.on('issue', onWarning);
      this.connection.on('failure', onError);
      this.client.emit('connected');

      resolve();

    });
  }

  disconnect() {
    return new Promise((resolve) => {
      this.connection.end();
      this.connection.removeAllListeners();
      this.connection = null;
      this.client.emit('disconnected');
      resolve();
    });
  }

  set(key, value, options) {
    return new Promise((resolve, reject) => {
      let method = 'set';
      let expire = 10;
      if (typeof options === 'object') {
        if (options.ignoreIfExists) method = 'add';
        if (options.onlyIfExists) method = 'replace';
        if (options.expire) expire = options.expire;
      }
      this.connection[method](key, value, expire, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  get(key) {
    return new Promise((resolve, reject) => {
      this.connection.get(key, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  }

  del(key) {
    return new Promise((resolve, reject) => {
      this.connection.del(key, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  flush() {
    return new Promise((resolve, reject) => {
      this.connection.flush((err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  async exists(key) {
    return await this.get(key) === undefined ? false : true;
  }

}

module.exports = MemcachedDialect;
