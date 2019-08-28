"use strict";

require("core-js/modules/es6.promise");

require("core-js/modules/es6.object.to-string");

require("core-js/modules/es6.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});

var os = require('os');

var chalk = require('chalk')["default"];

var child_process = require('child_process');

var packageJson = require('../../package.json');

var execSync = child_process.execSync;

var consoleRed = function consoleRed(log) {
  return consoleChalk('red', log);
};

var consoleYellow = function consoleYellow(log) {
  return consoleChalk('yellow', log);
};

var consoleGreen = function consoleGreen(log) {
  return consoleChalk('green', log);
};

var consoleGrey = function consoleGrey(log) {
  return consoleChalk('grey', log);
};

var consoleChalk = function consoleChalk(color, log) {
  return console.log(chalk[color](log));
};

exports.consoleRed = consoleRed;
exports.consoleYellow = consoleYellow;
exports.consoleGreen = consoleGreen;
exports.consoleGrey = consoleGrey;
exports.consoleChalk = consoleChalk;

var getVersion = function getVersion() {
  return "\uD83D\uDC49  Vyron v".concat(packageJson.version);
};

exports.getVersion = getVersion;

var printVersion = function printVersion() {
  return console.log("".concat(getVersion(), "\n"));
};

exports.printVersion = printVersion;

var shouldUseYarn = function shouldUseYarn() {
  return isCommandExist('yarn --version', {
    stdio: 'ignore'
  });
};

exports.shouldUseYarn = shouldUseYarn;

var shouldUseCnpm = function shouldUseCnpm() {
  return isCommandExist('cnpm --version', {
    stdio: 'ignore'
  });
};

exports.shouldUseCnpm = shouldUseCnpm;

var getUpdateCliCommand = function getUpdateCliCommand() {
  var command = '';

  if (shouldUseYarn()) {
    command = 'yarn global add vyron-cli@latest';
  } else if (shouldUseCnpm()) {
    command = 'cnpm i -g vyron-cli@latest';
  } else {
    command = 'npm vyron-cli@latest';
  }

  return command;
};

exports.getUpdateCliCommand = getUpdateCliCommand;

var isCommandExist = function isCommandExist(command) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  try {
    execSync(command, options);
    return true;
  } catch (e) {
    return false;
  }
};

exports.isCommandExist = isCommandExist;

var nodePromisify = function nodePromisify(fn) {
  return function () {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return new Promise(function (resolve, reject) {
      fn.apply(void 0, args.concat([function (err) {
        if (err) {
          reject(err);
        }

        for (var _len2 = arguments.length, others = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
          others[_key2 - 1] = arguments[_key2];
        }

        resolve.apply(void 0, others);
      }]));
    });
  };
};

exports.nodePromisify = nodePromisify;

function getUserHomeDir() {
  function homedir() {
    var env = process.env;
    var home = env.HOME;
    var user = env.LOGNAME || env.USER || env.LNAME || env.USERNAME;

    if (process.platform === 'win32') {
      return env.USERPROFILE || '' + env.HOMEDRIVE + env.HOMEPATH || home || '';
    }

    if (process.platform === 'darwin') {
      return home || (user ? '/Users/' + user : '');
    }

    if (process.platform === 'linux') {
      return home || (process.getuid() === 0 ? '/root' : user ? '/home/' + user : '');
    }

    return home || '';
  }

  return typeof os.homedir === 'function' ? os.homedir() : homedir();
}

exports.getUserHomeDir = getUserHomeDir;