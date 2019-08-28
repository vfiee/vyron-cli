"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

require("core-js/modules/es6.object.define-properties");

require("core-js/modules/es7.object.get-own-property-descriptors");

require("core-js/modules/es6.array.for-each");

require("core-js/modules/es6.array.filter");

require("core-js/modules/es6.symbol");

require("core-js/modules/web.dom.iterable");

require("core-js/modules/es6.array.iterator");

require("core-js/modules/es6.object.keys");

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

require("core-js/modules/es6.regexp.to-string");

require("core-js/modules/es6.date.to-string");

require("core-js/modules/es6.object.to-string");

require("core-js/modules/es6.object.assign");

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

require("core-js/modules/es6.object.define-property");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var path = require('path');

var fs = require('fs-extra');

var chalk = require('chalk')["default"];

var Conf = require('../../.vyron.json');

var _download = require('download-git-repo');

var _require = require('../utils/index'),
    consoleGrey = _require.consoleGrey,
    consoleGreen = _require.consoleGreen,
    consoleYellow = _require.consoleYellow,
    consoleRed = _require.consoleRed;

var Download =
/*#__PURE__*/
function () {
  function Download(options) {
    (0, _classCallCheck2["default"])(this, Download);
    this.config = Object.assign({
      url: "",
      template: "",
      projectName: "",
      description: "",
      projectDir: ""
    }, options);
  }

  (0, _createClass2["default"])(Download, [{
    key: "download",
    value: function download() {
      var _this = this;

      // 拉去github项目
      var _this$config = this.config,
          projectDir = _this$config.projectDir,
          projectName = _this$config.projectName;
      var url = url || this.getRepisitoryUrl();

      if (!url) {
        consoleRed('❌  Pull url is Invalid');
        return;
      }

      var tmpdir = path.join(projectDir, projectName);
      console.log();
      console.log("\uD83C\uDD95  Creating project in ".concat(chalk.yellow(tmpdir), " \n"));
      consoleGreen("\u2B55\uFE0F  Pulling repository. This might take a while... \n");

      _download(url, tmpdir, {
        clone: true
      }, function (err) {
        var msg = err ? chalk.red("\u274E  ".concat(err.toString())) : chalk.green('🎉  Pull successed');
        console.log("".concat(msg, " \n"));

        _this.writePackageJson();
      });
    }
  }, {
    key: "getRepisitoryUrl",
    value: function getRepisitoryUrl() {
      var _this$config$template = this.config.template,
          template = _this$config$template === void 0 ? '' : _this$config$template;
      var temUrl = Conf.respository[template];
      if (temUrl) return temUrl;
    }
  }, {
    key: "writePackageJson",
    value: function writePackageJson() {
      var _this$config2 = this.config,
          projectDir = _this$config2.projectDir,
          projectName = _this$config2.projectName,
          description = _this$config2.description,
          template = _this$config2.template;
      var tmpdir = path.join(projectDir, "".concat(projectName, "/package.json"));
      consoleYellow("\u8BFB\u53D6".concat(tmpdir, "\u6587\u4EF6\u4E2D.... \n"));
      var pacakgeJson = fs.readJsonSync(tmpdir);
      consoleGreen("\u2705  \u8BFB\u53D6".concat(tmpdir, "\u6210\u529F! \n"));
      consoleYellow("\u51C6\u5907\u5199\u5165 projectname description \u5230 ".concat(tmpdir, "... \n"));
      fs.writeFile(tmpdir, JSON.stringify(_objectSpread({}, pacakgeJson, {
        name: projectName,
        description: description
      }), null, 4));
      consoleGreen('✅  写入package.json成功! \n');
      consoleGreen('😸  happy coding');
      consoleGrey("\n            cd ".concat(path.join(projectDir, projectName), " \n\n            yarn install \n\n            yarn BD\n        \n"));
    }
  }]);
  return Download;
}();

exports["default"] = Download;