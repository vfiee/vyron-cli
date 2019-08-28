"use strict";

require("core-js/modules/es6.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});

var ora = require('ora');

var request = require('request');

var _require = require('child_process'),
    exec = _require.exec;

var _require2 = require('../utils'),
    consoleGreen = _require2.consoleGreen,
    consoleRed = _require2.consoleRed,
    nodePromisify = _require2.nodePromisify,
    getUpdateCliCommand = _require2.getUpdateCliCommand;

var _require3 = require('../../package.json'),
    version = _require3.version;

var promiseRequest = nodePromisify(request.get);

function checkUpdate() {
  var url = 'https://registry.npmjs.org/vyron-cli/latest';
  var pinner = ora('正在检查最新版本 \n').start();
  promiseRequest(url).then(function (res) {
    var originVer;

    try {
      originVer = _.get(JSON.parse(res.body), 'version');
    } catch (error) {
      originVer = version;
    }

    if (originVer === version) {
      pinner.succeed('当前版本已是最新版本~ \n');
    } else {
      pinner.stop("\u68C0\u6D4B\u5230\u6700\u65B0\u7248\u672C\u4E3A\uFF1Av".concat(originVer, "  \u51C6\u5907\u66F4\u65B0 \n"));
      updateCli(originVer);
    }
  })["catch"](function (err) {
    console.log(err);
  });
}

function updateCli(latestVer) {
  var command = getUpdateCliCommand();
  var spinner = ora('即将更新 vyron-cli 到最新版本... \n').start();
  exec(command, function (err, data) {
    consoleGreen("".concat(data, " \n"));

    if (err) {
      consoleRed(err);
      return;
    }

    console.log();
    spinner.succeed("\u2705  \u66F4\u65B0\u6210\u529F vyron-cli \u6210\u529F (v".concat(latestVer, ") \n"));
  });
}

exports["default"] = checkUpdate;