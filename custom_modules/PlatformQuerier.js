const os = require('os');

const eol = os.EOL;
const constants = os.constants;
const arch = os.arch();
const cpus = os.cpus();
const endianess = os.endianness;
const freemem = os.freemem();
const getPriority = (pid = 1001) => os.getPriority(pid);
const homedir = os.homedir;
const hostname = os.hostname;
const loadavg = os.loadavg;
const networkInterfaces = os.networkInterfaces();
const platform = os.platform();
const release = os.release();
const tmpDir = os.tmpdir();
const totalmem = os.totalmem();
const type = os.type();
const uptime = os.uptime();
const userInfo = (options = { encoding: 'utf8' }) => os.userInfo(options);

module.exports = {
    eol,
    constants,
    arch,
    cpus,
    endianess,
    freemem,
    priority: (pid = 0) => getPriority(pid),
    homedir,
    hostname,
    loadavg,
    netfaces: networkInterfaces,
    platform,
    release,
    tmpDir,
    totalmem,
    type,
    uptime,
    userinfo: (options = { encoding: 'utf8' }) => userInfo(options)
};