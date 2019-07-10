Object.defineProperty(exports, "__esModule", { value: true });

const _ = require('lodash');
const fs = require('fs-extra');
const inquirer = require('inquirer');
const Pull = require('../util/pull').default;
const conf = require('../config').default;

class Creator {
    constructor(options) {
        this.config = Object.assign({
            template: "",
            projectName: "",
            description: "",
            projectDir: "",
        }, options)
    }
    create() {
        this.ask()
            .then(answers => {
                this.config = Object.assign(this.config, answers);
                this.pull();
            });
    }
    ask() {
        const prompts = [];
        const config = this.config;
        if (!config['template'] || typeof config['template'] !== 'string') {
            prompts.push({
                type: 'list',
                name: 'template',
                message: '请选择项目模板',
                choices: this.getTemplates(),
            });
        }
        if (!config['projectName'] || typeof config['projectName'] !== 'string') {
            prompts.push({
                type: 'input',
                name: 'projectName',
                message: '请输入项目名称',
                validate(input) {
                    if (!input) return '项目名不能为空！';
                    if (fs.existsSync(input)) return '当前目录已经存在同名项目，请换一个项目名！';
                    return true;
                }
            });
        } else if (fs.existsSync(config['projectName'])) {
            prompts.push({
                type: 'input',
                name: 'projectName',
                message: '当前目录已经存在同名项目，请换一个项目名！',
                validate(input) {
                    if (!input) return '项目名不能为空！';
                    if (fs.existsSync(input)) return '项目名依然重复！';
                    return true;
                }
            });
        }
        if (!config['description'] || typeof config['description'] !== 'string') {
            prompts.push({
                type: 'input',
                name: 'description',
                message: '请输入项目介绍！'
            });
        }
        return inquirer.prompt(prompts);
    }
    getTemplates() {
        return _.map(conf.program, item => ({ name: item, value: item }));
    }
    getConfigTypes() {
        return [
            { key: 'template', type: 'list', errorMsg: '请选择项目模板', existsMsg: '当前模板不存在', regFunc: this.isInTemplates },
            { key: 'projectName', type: 'string', errorMsg: '请输入项目名称', existsMsg: '当前目录已经存在同名项目，请换一个项目名！', regFunc: fs.existsSync },
            { key: 'description', type: 'string', errorMsg: '请输入项目介绍', existsMsg: '当前目录已经存在同名项目，请换一个项目名！', regFunc: fs.existsSync },
        ];
    }
    isInTemplates(template) {
        return conf.program.includes(template);
    }
    pull() {
        let { template, projectName, description, projectDir, } = this.config;
        const pullIns = new Pull({
            url: conf.respository[template],
            projectName,
            description,
            projectDir,
        });
        pullIns.pullProject();
    }
}

exports.default = Creator;