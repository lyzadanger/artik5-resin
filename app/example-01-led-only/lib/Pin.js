var fs = require('fs');
var path = require('path');
var GPIO_PATH = '/sys/class/gpio';

var PIN_MAP = {
  '13': '135'
};

function writeGPIO (pinPath, fileName, value) {
  fs.writeFileSync(path.join(pinPath, fileName), value, { flag: 'w'});
}

function enablePin (pin, pinPath) {
  if (!fs.existsSync(pinPath)) {
    fs.writeFileSync(path.join(GPIO_PATH, 'export'), pin, {flag : 'w'});
  }
}

function DigitalPin (pinNum, mode) {
  if (typeof PIN_MAP[pinNum] == 'undefined') {
    throw new Error('Pin number ', pinNum, ' not found in lookup');
  }

  this.pin = PIN_MAP[pinNum];
  this.pinDir = 'gpio' + this.pin;
  this.pinPath = path.join(GPIO_PATH, this.pinDir);
  this.mode = mode;
  this.value = 0;

  enablePin(this.pin, this.pinPath);
  writeGPIO(this.pinPath, 'direction', this.mode);
  return this;
}

DigitalPin.prototype.write = function (level) {
  level = (level) ? 1 : 0;
  writeGPIO(this.pinPath, 'value', level);
  this.value = level;
};

DigitalPin.prototype.toggle = function () {
  this.write(!this.value);
};

module.exports = DigitalPin;
