
# Unofficial EpicGames Client for Node.js
[![npm version](https://img.shields.io/npm/v/keyer.svg)](https://npmjs.com/package/keyer)
[![npm downloads](https://img.shields.io/npm/dm/keyer.svg)](https://npmjs.com/package/keyer)
[![license](https://img.shields.io/npm/l/keyer.svg)](https://github.com/SzymonLisowiec/keyer/blob/master/LICENSE.MD)
[![paypal](https://img.shields.io/badge/paypal-donate-orange.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=FDN57KFYRP4CQ&source=url)

One client for all key-value databases. Why? Useful while you make e.g. cache library and you want support for multiple databases.

# Installation
```
npm i keyer --save
```

# Example
```javascript
const Keyer = require('keyer');

(async () => {

  const keyer = new Keyer({
    dialect: 'redis',
  });

  await keyer.connect();

  // Basic IO
  await keyer.set('hello', 'world');
  console.log(await keyer.get('hello')); // world
  console.log(await keyer.exists('hello')); // true
  await keyer.del('hello');
  console.log(await keyer.exists('hello')); // false

  // Support for lists
  await keyer.listAppend('mylist', 'item');
  console.log(await keyer.listGetRange('mylist', 0, -1)); // ['item']

})();

```


# Methods

## Basic

### checkSupport()
Returns object with all possible methods (as key) and `true` or `false`.
```javascript
{
  validateConfig: true,
  connect: true,
  disconnect: true,
  get: true,
  set: true,
  del: true,
  flush: true,
  exists: true,
  listAppend: true,
  listPrepend: true,
  listPop: true,
  listShift: true,
  listLength: true,
  listSetIndex: true,
  listGetIndex: true,
  listGetRange: true,
  listGetFull: true,
}
```

### connect()
### disconnect()

### get(key)
Returns value for given key.

### set(key, value, options)
```javascript
await keyer.set('foo', 'bar', {
  expire: 60, // expire time in seconds
  expireMs: 60000, // also you can give expire time in milliseconds,
  onlyIfExists: true, // only modify already existing key
  ignoreIfExists: true, // don't set key if already exists
});
```

### del(key)
Removes the specified key.

### flush()
Flush database.

### exists(key)
Returns `true` if key exists or `false` if not exists.

## Lists

### listAppend(key, value, onlyIfExists)
Adds value to the end of list.

### listPrepend(key, value, onlyIfExists)
Adds value to the beginning of list.

### listPop(key)
Removes the last value of list and returns removed value.

### listShift(key)
Removes the first value of list and returns removed value.

### listLength(key)
Returns length of list.

### listSetIndex(key, index, value)
Sets value on the specified index of list.

### listGetIndex(key, index)
Returns value of the specified index of list.

### listGetRange(key, start, end)
Returns value in specified indexes range of list.

### listGetFull(key)
Returns full list.

# Methods support

. | Redis
:---|:---:
connect | ✓
disconnect | ✓
get | ✓
set | ✓
del | ✓
flush | ✓
exists | ✓
listAppend | ✓
listPrepend | ✓
listPop | ✓
listShift | ✓
listLength | ✓
listSetIndex | ✓
listGetIndex | ✓
listGetRange | ✓
listGetFull | ✓

# License
MIT License

Copyright (c) 2019 Szymon Lisowiec

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
