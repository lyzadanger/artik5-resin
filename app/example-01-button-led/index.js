const Pin = require('./lib/Pin');
const LedPin = new Pin('13', 'out');
const button = new Pin('2', 'in');

button.watch(value => {
  console.log(value);
  console.log('yup');
});

setInterval(function () {
  LedPin.toggle();
}, 1000);
