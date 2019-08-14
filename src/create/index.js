Object.defineProperty(exports, "__esModule", { value: true });

const _ = require('lodash');
const path = require('path');
const fs = require('fs-extra');
const inquirer = require('inquirer');
const child_process = require('child_process');
const yaml = require('js-yaml');
const Download = require('../download').default;
const conf = require('../../.vyron.json');
const {
    consoleRed,
    consoleGreen,
    consoleYellow,
    isCommandExist,
} = require('../utils');

const execSync = child_process.execSync;

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
                this.createProject();
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
        if (!config['projectName'] ||
            typeof config['projectName'] !== 'string' ||
            !conf.program.includes(config['projectName'])
        ) {
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
    createProject() {
        let { template } = this.config;
        if (!template) {
            consoleRed('您选择的模板不存在 \n');
            return;
        } else if (template === 'flutter') {
            this.createProjectByExec();
        } else {
            this.createProjectByGit();
        }
    }
    writeDescription() {
        let { projectDir, projectName, description } = this.config;
        let caseProjectName = _.snakeCase(projectName);
        let tmpdir = path.resolve(projectDir, `${caseProjectName}`);
        let yamlPath = path.join(tmpdir, 'pubspec.yaml');
        try {
            consoleYellow(`读取${yamlPath}文件中.... \n`);
            fs.existsSync(yamlPath);
        } catch (error) {
            consoleRed(`${yamlPath}文件路径不存在`);
            return;
        }
        consoleGreen(`✅  读取${yamlPath}成功! \n`);
        let pubspecYaml = yaml.load(fs.readFileSync(yamlPath, 'utf-8'));
        consoleYellow(`准备写入 projectname description 到 ${yamlPath}... \n`);
        pubspecYaml.description = description;
        pubspecYaml = yaml.dump(pubspecYaml, 'utf-8');
        fs.writeFileSync(yamlPath, pubspecYaml, 'utf-8');
        consoleGreen(`✅  写入pubspec.yaml成功! \n`);
        consoleYellow(`获取 flutter 依赖包 \n`);
        execSync(`cd ${tmpdir} && flutter packages get`);
        consoleGreen(`✅  flutter packages get success! \n`);
        consoleGreen(`🥰  happy coding flutter \n`);
    }
    createProjectByExec() {
        let { projectName, projectDir, } = this.config;
        if (!isCommandExist('flutter --version')) {
            consoleRed(`command not found: flutter  \n`);
            return;
        }
        let caseProjectName = _.snakeCase(projectName);
        try {
            consoleYellow(`正在创建flutter项目（${caseProjectName}）\n`);
            execSync(`cd ${projectDir} && flutter create ${caseProjectName}`);
            consoleGreen(`✅  flutter项目（${caseProjectName}）创建成功 \n`);
            this.writeDescription();
        } catch (err) {
            consoleRed(err);
        }
    }
    createProjectByGit() {
        let { template, projectName, description, projectDir, } = this.config;
        const DownloadIns = new Download({
            template,
            projectName,
            description,
            projectDir,
        });
        DownloadIns.download();
    }
}

exports.default = Creator;