Object.defineProperty(exports, "__esModule", { value: true });

const packageJson = require('../package.json');

const getVersion = () => `👉  Vyron v${packageJson.version}`;

const printVersion = () => console.log(getVersion());

exports.getVersion = getVersion;
exports.printVersion = printVersion;