Object.defineProperty(exports, "__esModule", { value: true });

const packageJson = require('../package.json');
const child_process = require('child_process');
const execSync = child_process.execSync;

const getVersion = () => `👉  Vyron v${packageJson.version}`;
exports.getVersion = getVersion;


const printVersion = () => console.log(`${getVersion()}\n`);
exports.printVersion = printVersion;


const shouldUseYarn = () => {
    try {
        execSync('yarn --version', { stdio: 'ignore' });
        return true;
    } catch (e) {
        return false;
    }
}
exports.shouldUseYarn = shouldUseYarn;
const shouldUseCnpm = () => {
    try {
        execSync('cnpm --version', { stdio: 'ignore' });
        return true;
    }
    catch (e) {
        return false;
    }
}
exports.shouldUseCnpm = shouldUseCnpm;

const getUpdateCliCommand = () => {
    let command = '';
    if (shouldUseYarn()) {
        command = 'yarn global add vyron-cli@latest';
    } else if (shouldUseCnpm()) {
        command = 'cnpm i -gvyron-cli@latest';
    } else {
        command = 'npm vyron-cli@latest';
    }
    return command;
}

exports.getUpdateCliCommand = getUpdateCliCommand;