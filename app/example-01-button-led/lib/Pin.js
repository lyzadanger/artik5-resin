const fs = require('fs');
const path = require('path');
const EPoll = require('epoll').Epoll;

const GPIO_PATH = '/sys/class/gpio';

const PIN_MAP = {
  2: '121',
  13: '135'
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
  pinNum = +pinNum;
  this.pin = PIN_MAP[pinNum];
  if (this.pin == 'undefined') {
    throw new Error(`Pin number ${pinNum} not found in mapping`);
  }

  this.pinDir = `gpio${this.pin}`;
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

DigitalPin.prototype.watch = function (fn) {
  const valuefd = fs.openSync(path.join(this.pinPath, 'value'), 'r');
  var buffer = new Buffer(1);

  this.poller = new EPoll((err, fd, events) => {
    fs.readSync(fd, buffer, 0, 1, 0);
    this.fn(buffer);
  });
  fs.readSync(valuefd, buffer, 0, 1, 0);
  this.poller.add(valuefd, EPoll.EPOLLPRI);
};

module.exports = DigitalPin;
