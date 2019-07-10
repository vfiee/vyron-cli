Object.defineProperty(exports, "__esModule", { value: true });

const chalk = require('chalk').default;

const download = require('download-git-repo');

const path = require('path');

const ora = require('ora');


class Pull {
    constructor(options) {
        this.config = Object.assign({
            url: "",
            projectName: "",
            description: "",
            projectDir: "",
        }, options)
    }
    async pullProject() {
        // 拉去github项目
        let { url, projectDir, projectName } = this.config;
        const tmpdir = path.join(projectDir, projectName);
        console.log();
        console.log(`🆕  Creating project in ${chalk.yellow(tmpdir)}`);
        console.log();
        console.log(chalk.green(`⭕️  Pulling repository. This might take a while...`));
        download(url, tmpdir, { clone: true }, err => {
            let msg = err ? chalk.red('❎  Something wrong happend') : chalk.green('🎉  Pull successed');
            console.log();
            console.log(msg);
        });
    }
}

exports.default = Pull;
// HEAD-6539b02_1