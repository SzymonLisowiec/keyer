const Keyer = require('.');

(async () => {

  const keyer = new Keyer({
    dialect: 'redis',
  });

  await keyer.connect();

  await keyer.set('hello', 'world');
  console.log(await keyer.get('hello')); // world
  console.log(await keyer.exists('hello')); // true
  await keyer.del('hello');
  console.log(await keyer.exists('hello')); // false
  await keyer.listAppend('mylist', 'item');
  console.log(await keyer.listGetRange('mylist', 0, -1)); // ['item']

})();
