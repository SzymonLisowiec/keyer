const Redis = require('redis');

class RedisDialect {

  constructor(client) {
    this.name = 'redis';
    this.client = client;
    this.config = this.client.config;
    this.connection = null;
  }

  validateConfig() {
    if (!this.config.host) this.config.host = '127.0.0.1';
    if (!this.config.port) this.config.port = 6379;
    if (!this.config.database) this.config.database = 0;
    this.config.db = this.config.database;
  }

  connect() {
    return new Promise((resolve, reject) => {

      this.connection = Redis.createClient(this.config);

      const onError = (err) => {
        this.connection.off('ready', onReady);
        this.connection = null;
        this.client.emit('error', err);
        reject(err);
      };

      const onReady = () => {
        this.connection.off('error', onError);
        this.client.emit('connected');
        this.connection.on('error', (...args) => {
          this.client.emit('error', ...args);
        });
        this.connection.on('warning', (...args) => {
          this.client.emit('warning', ...args);
        });
        resolve();
      };

      this.connection.once('error', onError);
      this.connection.once('ready', onReady);

    });
  }

  disconnect() {
    return new Promise((resolve) => {
      this.connection.end();
      this.connection.once('end', () => {
        this.connection.removeAllListeners();
        this.connection = null;
        this.client.emit('disconnected');
        resolve();
      });
    });
  }

  set(key, value, options) {
    return new Promise((resolve, reject) => {
      let args = [];
      if (typeof options === 'object') {
        if (options.ignoreIfExists) args.push('NX');
        if (options.onlyIfExists) args.push('XX');
        if (options.expire) args.push('EX', options.expire);
      }
      this.connection.set(key, value, ...args, (err) => {
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
      this.connection.send_command('FLUSHDB', (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  exists(key) {
    return new Promise((resolve, reject) => {
      this.connection.exists(key, (err, result) => {
        if (err) reject(err);
        else resolve(!!result);
      });
    });
  }

  listAppend(key, value, onlyIfExists) {
    return new Promise((resolve, reject) => {
      this.connection.send_command(onlyIfExists ? 'RPUSHX' : 'RPUSH', [key, value], (err, result) => {
        if (err) reject(err);
        else resolve(parseInt(result));
      });
    });
  }

  listPrepend(key, value, onlyIfExists) {
    return new Promise((resolve, reject) => {
      this.connection.send_command(onlyIfExists ? 'LPUSHX' : 'LPUSH', [key, value], (err, result) => {
        if (err) reject(err);
        else resolve(parseInt(result));
      });
    });
  }

  listPop(key) {
    return new Promise((resolve, reject) => {
      this.connection.send_command('RPOP', [key], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  }

  listShift(key) {
    return new Promise((resolve, reject) => {
      this.connection.send_command('LPOP', [key], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  }

  listLength(key) {
    return new Promise((resolve, reject) => {
      this.connection.send_command('LLEN', [key], (err, result) => {
        if (err) reject(err);
        else resolve(parseInt(result));
      });
    });
  }

  listSetIndex(key, index, value) {
    return new Promise((resolve, reject) => {
      this.connection.send_command('LSET', [key, index, value], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  listGetIndex(key, index) {
    return new Promise((resolve, reject) => {
      this.connection.send_command('LINDEX', [key, index], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  }

  listGetRange(key, start, end) {
    return new Promise((resolve, reject) => {
      this.connection.send_command('LRANGE', [key, start, end], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  }

  listGetFull(key) {
    return this.listGetRange(key, 0, -1)
  }

}

module.exports = RedisDialect;
