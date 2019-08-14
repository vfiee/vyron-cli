Object.defineProperty(exports, "__esModule", { value: true });

const ora = require('ora');
const request = require('request');
const { exec } = require('child_process');
const {
    consoleGreen,
    consoleRed,
    nodePromisify,
    getUpdateCliCommand
} = require('../utils');
const { version } = require('../../package.json')

const promiseRequest = nodePromisify(request.get);

function checkUpdate() {
    let url = 'https://registry.npmjs.org/vyron-cli/latest';
    let pinner = ora('正在检查最新版本 \n').start();
    promiseRequest(url).then(res => {
        let originVer;
        try {
            originVer = _.get(JSON.parse(res.body), 'version');
        } catch (error) {
            originVer = version;
        }
        if (originVer === version) {
            pinner.succeed('当前版本已是最新版本~ \n');
        } else {
            pinner.stop(`检测到最新版本为：v${originVer}  准备更新 \n`);
            updateCli(originVer);
        }
    }).catch(err => {
        console.log(err);
    })
}

function updateCli(latestVer) {
    let command = getUpdateCliCommand();
    const spinner = ora('即将更新 vyron-cli 到最新版本... \n').start();
    exec(command, (err, data) => {
        consoleGreen(`${data} \n`);
        if (err) {
            consoleRed(err);
            return;
        }
        console.log();
        spinner.succeed(`✅  更新成功 vyron-cli 成功 (v${latestVer}) \n`);
    });
}

exports.default = checkUpdate;