"use strict";

require("core-js/modules/es6.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ = require('lodash');

var path = require('path');

var fs = require('fs-extra');

var _require = require('../utils'),
    consoleYellow = _require.consoleYellow,
    consoleRed = _require.consoleRed,
    consoleGreen = _require.consoleGreen,
    getUserHomeDir = _require.getUserHomeDir;

var homeDir = getUserHomeDir();
var fileDir = path.join(homeDir, '.vyron.json');

var CONFIG = require(fileDir);

var INIT_CONFIG = {
  "program": ["taro", "flutter", "ant-pro-electron"],
  "respository": {
    "taro": "github:VFiee/taro-base",
    "ant-pro-electron": "github:VFiee/ant-pro-electron"
  }
};

function getConfig(key) {
  var result;

  try {
    result = JSON.stringify(_.get(CONFIG, key), null, 4);
  } catch (error) {
    result = '';
  }

  consoleYellow(result);
}

exports.getConfig = getConfig;

function setConfig(key, value) {
  _.set(CONFIG, key, value);

  fs.writeFileSync(fileDir, JSON.stringify(CONFIG, null, 4));
  consoleYellow("\u5199\u5165\u6210\u529F \n");
  listConfig();
}

exports.setConfig = setConfig;

function listConfig() {
  consoleYellow("".concat(JSON.stringify(CONFIG, null, 4), " \n"));
}

exports.listConfig = listConfig;

function deleteConfig(key) {
  if (_.get(CONFIG, key)) {
    _.unset(CONFIG, key);

    fs.writeFileSync(fileDir, JSON.stringify(CONFIG, null, 4));
    consoleYellow("\u5220\u9664\u6210\u529F");
    listConfig();
  } else {
    consoleRed("".concat(key, " \u4E0D\u5B58\u5728~ \n"));
  }
}

exports.deleteConfig = deleteConfig;

function initConfig() {
  fs.writeFileSync(fileDir, JSON.stringify(INIT_CONFIG, null, 4));
  consoleGreen('初始化配置成功');
  listConfig();
}

exports.initConfig = initConfig;