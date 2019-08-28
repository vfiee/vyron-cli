"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

require("core-js/modules/es6.array.map");

require("core-js/modules/es7.array.includes");

require("core-js/modules/es6.string.includes");

require("core-js/modules/es6.object.assign");

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

require("core-js/modules/es6.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ = require('lodash');

var path = require('path');

var fs = require('fs-extra');

var inquirer = require('inquirer');

var child_process = require('child_process');

var yaml = require('js-yaml');

var Download = require('../download')["default"];

var conf = require('../../.vyron.json');

var _require = require('../utils'),
    consoleRed = _require.consoleRed,
    consoleGreen = _require.consoleGreen,
    consoleYellow = _require.consoleYellow,
    isCommandExist = _require.isCommandExist;

var execSync = child_process.execSync;

var Creator =
/*#__PURE__*/
function () {
  function Creator(options) {
    (0, _classCallCheck2["default"])(this, Creator);
    this.config = Object.assign({
      template: "",
      projectName: "",
      description: "",
      projectDir: ""
    }, options);
  }

  (0, _createClass2["default"])(Creator, [{
    key: "create",
    value: function create() {
      var _this = this;

      this.ask().then(function (answers) {
        _this.config = Object.assign(_this.config, answers);

        _this.createProject();
      });
    }
  }, {
    key: "ask",
    value: function ask() {
      var prompts = [];
      var config = this.config;

      if (!config['template'] || typeof config['template'] !== 'string') {
        prompts.push({
          type: 'list',
          name: 'template',
          message: '请选择项目模板',
          choices: this.getTemplates()
        });
      }

      if (!config['projectName'] || typeof config['projectName'] !== 'string' || !conf.program.includes(config['projectName'])) {
        prompts.push({
          type: 'input',
          name: 'projectName',
          message: '请输入项目名称',
          validate: function validate(input) {
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
          validate: function validate(input) {
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
  }, {
    key: "getTemplates",
    value: function getTemplates() {
      return _.map(conf.program, function (item) {
        return {
          name: item,
          value: item
        };
      });
    }
  }, {
    key: "getConfigTypes",
    value: function getConfigTypes() {
      return [{
        key: 'template',
        type: 'list',
        errorMsg: '请选择项目模板',
        existsMsg: '当前模板不存在',
        regFunc: this.isInTemplates
      }, {
        key: 'projectName',
        type: 'string',
        errorMsg: '请输入项目名称',
        existsMsg: '当前目录已经存在同名项目，请换一个项目名！',
        regFunc: fs.existsSync
      }, {
        key: 'description',
        type: 'string',
        errorMsg: '请输入项目介绍',
        existsMsg: '当前目录已经存在同名项目，请换一个项目名！',
        regFunc: fs.existsSync
      }];
    }
  }, {
    key: "isInTemplates",
    value: function isInTemplates(template) {
      return conf.program.includes(template);
    }
  }, {
    key: "createProject",
    value: function createProject() {
      var template = this.config.template;

      if (!template) {
        consoleRed('您选择的模板不存在 \n');
        return;
      } else if (template === 'flutter') {
        this.createProjectByExec();
      } else {
        this.createProjectByGit();
      }
    }
  }, {
    key: "writeDescription",
    value: function writeDescription() {
      var _this$config = this.config,
          projectDir = _this$config.projectDir,
          projectName = _this$config.projectName,
          description = _this$config.description;

      var caseProjectName = _.snakeCase(projectName);

      var tmpdir = path.resolve(projectDir, "".concat(caseProjectName));
      var yamlPath = path.join(tmpdir, 'pubspec.yaml');

      try {
        consoleYellow("\u8BFB\u53D6".concat(yamlPath, "\u6587\u4EF6\u4E2D.... \n"));
        fs.existsSync(yamlPath);
      } catch (error) {
        consoleRed("".concat(yamlPath, "\u6587\u4EF6\u8DEF\u5F84\u4E0D\u5B58\u5728"));
        return;
      }

      consoleGreen("\u2705  \u8BFB\u53D6".concat(yamlPath, "\u6210\u529F! \n"));
      var pubspecYaml = yaml.load(fs.readFileSync(yamlPath, 'utf-8'));
      consoleYellow("\u51C6\u5907\u5199\u5165 projectname description \u5230 ".concat(yamlPath, "... \n"));
      pubspecYaml.description = description;
      pubspecYaml = yaml.dump(pubspecYaml, 'utf-8');
      fs.writeFileSync(yamlPath, pubspecYaml, 'utf-8');
      consoleGreen("\u2705  \u5199\u5165pubspec.yaml\u6210\u529F! \n");
      consoleYellow("\u83B7\u53D6 flutter \u4F9D\u8D56\u5305 \n");
      execSync("cd ".concat(tmpdir, " && flutter packages get"));
      consoleGreen("\u2705  flutter packages get success! \n");
      consoleGreen("\uD83E\uDD70  happy coding flutter \n");
    }
  }, {
    key: "createProjectByExec",
    value: function createProjectByExec() {
      var _this$config2 = this.config,
          projectName = _this$config2.projectName,
          projectDir = _this$config2.projectDir;

      if (!isCommandExist('flutter --version')) {
        consoleRed("command not found: flutter  \n");
        return;
      }

      var caseProjectName = _.snakeCase(projectName);

      try {
        consoleYellow("\u6B63\u5728\u521B\u5EFAflutter\u9879\u76EE\uFF08".concat(caseProjectName, "\uFF09\n"));
        execSync("cd ".concat(projectDir, " && flutter create ").concat(caseProjectName));
        consoleGreen("\u2705  flutter\u9879\u76EE\uFF08".concat(caseProjectName, "\uFF09\u521B\u5EFA\u6210\u529F \n"));
        this.writeDescription();
      } catch (err) {
        consoleRed(err);
      }
    }
  }, {
    key: "createProjectByGit",
    value: function createProjectByGit() {
      var _this$config3 = this.config,
          template = _this$config3.template,
          projectName = _this$config3.projectName,
          description = _this$config3.description,
          projectDir = _this$config3.projectDir;
      var DownloadIns = new Download({
        template: template,
        projectName: projectName,
        description: description,
        projectDir: projectDir
      });
      DownloadIns.download();
    }
  }]);
  return Creator;
}();

exports["default"] = Creator;