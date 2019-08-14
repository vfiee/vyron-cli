Object.defineProperty(exports, "__esModule", { value: true });


const _ = require('lodash');
const path = require('path');
const fs = require('fs-extra');
const {
    consoleYellow,
    consoleRed,
    consoleGreen,
} = require('../utils');
const fileDir = path.join(process.cwd(), '.vyron.json');

let CONFIG = require(fileDir);


const INIT_CONFIG = {
    "program": [
        "taro",
        "flutter",
        "ant-pro-electron"
    ],
    "respository": {
        "taro": "direct:http://weipengjiang@gitlab.zhen22.net/weipengjiang/taro-base.git",
        "ant-pro-electron": "direct:http://weipengjiang@gitlab.zhen22.net/weipengjiang/electron-umi-ant-base.git"
    }
};

function getConfig(key) {
    consoleYellow(_.get(CONFIG, `${key}`, ''));
}
exports.getConfig = getConfig;


function setConfig(key, value) {
    fs.writeFileSync(fileDir, JSON.stringify({ ...CONFIG, [key]: value }, null, 4));
    consoleYellow(`写入成功 \n`);
}
exports.setConfig = setConfig;


function listConfig(isJson) {
    consoleYellow(`${JSON.stringify(CONFIG, null, 4)} \n`);
}
exports.listConfig = listConfig;


function deleteConfig(key) {
    if (CONFIG[key]) {
        delete CONFIG[key];
        fs.writeFileSync(fileDir, JSON.stringify(CONFIG, null, 4));
    } else {
        consoleRed(`${key} 不存在~ \n`);
    }
}
exports.deleteConfig = deleteConfig;

function initConfig() {
    fs.writeFileSync(fileDir, JSON.stringify(INIT_CONFIG, null, 4));
    consoleGreen('初始化配置成功');
}
exports.initConfig = initConfig;
