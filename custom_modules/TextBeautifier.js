const chalk = require('chalk');
const { cap } = require('./cfc');

const error = (arg = '') => {
    return (chalk.rgb(134, 100, 100).bold('\n' + cap(`${arg}`)));
};

const warning = (arg = '') => {
    return (chalk.rgb(134, 134, 100).bold('\n' + cap(`${arg}`)));
};

const success = (arg = '') => {
    return (chalk.rgb(100, 134, 100).bold('\n' + cap(`${arg}`)));
};

const failure = (arg = '') => {
    return (chalk.rgb(117, 130, 130).bold('\n' + cap(`${arg}`)));
};

const information = (arg = '') => {
    return (chalk.rgb(100, 128, 254).bold('\n' + cap(`${arg}`)));
};

const fyi = (arg = '') => {
    return chalk.rgb(233, 233, 20).bold(`${cap(arg)}`);
};

const primary = (arg = '') => {
    return chalk.rgb(18, 200, 104).bold(`${cap(arg)}`);
};

module.exports = {
    error,
    warning,
    success,
    failure,
    information,
    fyi,
    primary
};