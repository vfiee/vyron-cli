Object.defineProperty(exports, "__esModule", { value: true });

const path = require('path');
const fs = require('fs-extra');
const chalk = require('chalk').default;
const Conf = require('../../.vyron.json');
const download = require('download-git-repo');
const {
    consoleGrey,
    consoleGreen,
    consoleYellow,
    consoleRed,
} = require('../utils/index');

class Download {
    constructor(options) {
        this.config = Object.assign({
            url: "",
            template: "",
            projectName: "",
            description: "",
            projectDir: "",
        }, options)
    }
    download() {
        // 拉去github项目
        let { projectDir, projectName } = this.config;
        let url = url || this.getRepisitoryUrl();
        if (!url) {
            consoleRed('❌  Pull url is Invalid');
            return;
        }
        const tmpdir = path.join(projectDir, projectName);
        console.log();
        console.log(`🆕  Creating project in ${chalk.yellow(tmpdir)} \n`);
        consoleGreen(`⭕️  Pulling repository. This might take a while... \n`);
        download(url, tmpdir, { clone: true }, err => {
            let msg = err ? chalk.red(`❎  ${err.toString()}`) : chalk.green('🎉  Pull successed');
            console.log(`${msg} \n`);
            this.writePackageJson();
        });
    }
    getRepisitoryUrl() {
        let { template = '' } = this.config;
        let temUrl = Conf.respository[template];
        if (temUrl) return temUrl;
    }
    writePackageJson() {
        let { projectDir, projectName, description, template } = this.config;
        let tmpdir = path.join(projectDir, `${projectName}/package.json`);
        consoleYellow(`读取${tmpdir}文件中.... \n`);
        let pacakgeJson = fs.readJsonSync(tmpdir);
        consoleGreen(`✅  读取${tmpdir}成功! \n`);
        consoleYellow(`准备写入 projectname description 到 ${tmpdir}... \n`);
        fs.writeFile(tmpdir, JSON.stringify({
            ...pacakgeJson,
            name: projectName,
            description,
        }, null, 4));
        consoleGreen('✅  写入package.json成功! \n');
        consoleGreen('😸  happy coding');
        consoleGrey(`
            cd ${path.join(projectDir, projectName)} \n
            yarn install \n
            yarn BD
        \n`);
    }
}

exports.default = Download;