var DigitalPin = require('./lib/DigitalPin');

var pinNum = '13';
var LedPin = new DigitalPin('13', 'out');

setInterval(function () {
  LedPin.toggle();
}, 1000);
