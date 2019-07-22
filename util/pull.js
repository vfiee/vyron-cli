Object.defineProperty(exports, "__esModule", { value: true });

const chalk = require('chalk').default;
const download = require('download-git-repo');
const path = require('path');
const fs = require('fs-extra');
const Conf = require('../config').default;

class Pull {
    constructor(options) {
        this.config = Object.assign({
            url: "",
            template: "",
            projectName: "",
            description: "",
            projectDir: "",
        }, options)
    }
    async pullProject() {
        // 拉去github项目
        let { projectDir, projectName } = this.config;
        let url = url || this.getRepisitoryUrl();
        if (!url) {
            console.log(chalk.red('❌  Pull url is Invalid'));
        }
        const tmpdir = path.join(projectDir, projectName);
        console.log();
        console.log(`🆕  Creating project in ${chalk.yellow(tmpdir)} \n`);
        console.log(chalk.green(`⭕️  Pulling repository. This might take a while... \n`));
        download(url, tmpdir, { clone: true }, err => {
            let msg = err ? chalk.red('❎  Something wrong happend') : chalk.green('🎉  Pull successed');
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
        console.log(chalk.yellow(`读取${tmpdir}文件中.... \n`));
        let pacakgeJson = fs.readJsonSync(tmpdir);
        console.log(chalk.green(`✅  读取${tmpdir}成功! \n`));
        console.log(chalk.yellow(`准备写入 projectname description 到 ${tmpdir}... \n`));
        fs.writeJsonSync(tmpdir, JSON.stringify({
            ...pacakgeJson,
            name: projectName,
            description,
        }, null, 4));
        console.log(chalk.green('✅  写入package.json成功! \n'));
        console.log(chalk.green('😸  happy coding'));
        if (template !== 'flutter') {
            console.log(chalk.gray(`
            cd ${path.join(projectDir, projectName)} \n
            yarn install \n
            yarn BD
        \n`));
        }
    }
}

exports.default = Pull;