Object.defineProperty(exports, "__esModule", { value: true });

const os = require('os');
const chalk = require('chalk').default;
const child_process = require('child_process');
const packageJson = require('../../package.json');
const execSync = child_process.execSync;


const consoleRed = log => consoleChalk('red', log);

const consoleYellow = log => consoleChalk('yellow', log);

const consoleGreen = log => consoleChalk('green', log);

const consoleGrey = log => consoleChalk('grey', log);

const consoleChalk = (color, log) => console.log(chalk[color](log));

exports.consoleRed = consoleRed;
exports.consoleYellow = consoleYellow;
exports.consoleGreen = consoleGreen;
exports.consoleGrey = consoleGrey;
exports.consoleChalk = consoleChalk;


const getVersion = () => `👉  Vyron v${packageJson.version}`;
exports.getVersion = getVersion;


const printVersion = () => console.log(`${getVersion()}\n`);
exports.printVersion = printVersion;


const shouldUseYarn = () => isCommandExist('yarn --version', { stdio: 'ignore' });
exports.shouldUseYarn = shouldUseYarn;


const shouldUseCnpm = () => isCommandExist('cnpm --version', { stdio: 'ignore' });
exports.shouldUseCnpm = shouldUseCnpm;


const getUpdateCliCommand = () => {
    let command = '';
    if (shouldUseYarn()) {
        command = 'yarn global add vyron-cli@latest';
    } else if (shouldUseCnpm()) {
        command = 'cnpm i -g vyron-cli@latest';
    } else {
        command = 'npm vyron-cli@latest';
    }
    return command;
}
exports.getUpdateCliCommand = getUpdateCliCommand;


const isCommandExist = (command, options = {}) => {
    try {
        execSync(command, options);
        return true
    } catch (e) {
        return false;
    }
}
exports.isCommandExist = isCommandExist;

const nodePromisify = (fn) => {
    return function (...args) {
        return new Promise((resolve, reject) => {
            fn(...args, (err, ...others) => {
                if (err) {
                    reject(err);
                }
                resolve(...others);
            });
        });
    };
};
exports.nodePromisify = nodePromisify;



function getUserHomeDir() {
    function homedir() {
        const env = process.env;
        const home = env.HOME;
        const user = env.LOGNAME || env.USER || env.LNAME || env.USERNAME;
        if (process.platform === 'win32') {
            return env.USERPROFILE || '' + env.HOMEDRIVE + env.HOMEPATH || home || '';
        }
        if (process.platform === 'darwin') {
            return home || (user ? '/Users/' + user : '');
        }
        if (process.platform === 'linux') {
            return home || (process.getuid() === 0 ? '/root' : (user ? '/home/' + user : ''));
        }
        return home || '';
    }
    return typeof os.homedir === 'function' ? os.homedir() : homedir();
}

exports.getUserHomeDir = getUserHomeDir;