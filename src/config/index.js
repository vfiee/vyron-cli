Object.defineProperty(exports, "__esModule", { value: true });


const _ = require('lodash');
const path = require('path');
const fs = require('fs-extra');
const {
    consoleYellow,
    consoleRed,
    consoleGreen,
    getUserHomeDir,
} = require('../utils');
const homeDir = getUserHomeDir();
const fileDir = path.join(homeDir, '.vyron.json');

let CONFIG = require(fileDir);


const INIT_CONFIG = {
    "program": [
        "taro",
        "flutter",
        "ant-pro-electron"
    ],
    "respository": {
        "taro": "github:VFiee/taro-base",
        "ant-pro-electron": "github:VFiee/ant-pro-electron"
    }
};

function getConfig(key) {
    let result;
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
    consoleYellow(`写入成功 \n`);
    listConfig();
}
exports.setConfig = setConfig;


function listConfig() {
    consoleYellow(`${JSON.stringify(CONFIG, null, 4)} \n`);
}
exports.listConfig = listConfig;


function deleteConfig(key) {
    if (_.get(CONFIG, key)) {
        _.unset(CONFIG, key)
        fs.writeFileSync(fileDir, JSON.stringify(CONFIG, null, 4));
        consoleYellow(`删除成功`);
        listConfig();
    } else {
        consoleRed(`${key} 不存在~ \n`);
    }
}
exports.deleteConfig = deleteConfig;

function initConfig() {
    fs.writeFileSync(fileDir, JSON.stringify(INIT_CONFIG, null, 4));
    consoleGreen('初始化配置成功');
    listConfig();
}
exports.initConfig = initConfig;
