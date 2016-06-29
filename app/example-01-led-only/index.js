var Pin = require('./lib/Pin');

var pinNum = '13';
var LedPin = new Pin('13', 'out');

setInterval(function () {
  LedPin.toggle();
}, 1000);
