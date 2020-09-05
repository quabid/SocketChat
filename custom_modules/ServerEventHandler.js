const Url = require('url');
const {
    log,
    table
} = require('./Logger');
const {
    objectUtils: {
        keys,
        methods
    }
} = require('./utils');
const line = `*************************************************`;

module.exports = (server) => {
    let requestEventCount = 1;

    server.on('connection', (socket) => {
        // table([methods(socket)]);
    });

    server.on('request', (req, res) => {
        let requestEventStatus = '';
        switch (requestEventCount) {
            case 1:
                requestEventStatus = `${requestEventCount} time\t\t`;
                break;

            default:
                requestEventStatus = `${requestEventCount} times\t`;
                break;
         };

        const {
            method,
            socket,
            url,
            headers
        } = req;

        log(`\n${line}`);
        log(`*  Server On Request Event Fired ${requestEventStatus}*`);
        log(`*\tMethod: ${method}\t\t\t\t*`);
        log(`*\tCache: ${headers['pragma'] || 'no info'}\t\t\t\t*`);
        log(`*\tReferer: ${(headers['referer'] || '\t\t')}\t\t*`);
        log(`*\tURL: ${Url.parse(url).pathname }\t\t\t*`);

        switch (method.toLowerCase().trim()) {
            case 'get':
                // log(`*\tGet Request\t\t\t\t*`);
                break;

            case 'post':
                log(`*\tPost Request\t\t\t\t\t*`);
                break;
            
            case 'delete':
                log(`*\tDelete Request\t\t\t\t\t*`);
                break;

            case 'put':
                log(`*\tPut Request\t\t*`);
            break;

            default:
                log(`*\t${method.toLowerCase().trim()} Request\t\t*`);
                break;
        }
        requestEventCount++;

        log(`${line}\n\n`);
    });

    server.on('clientError', (err, socket) => {
        socket.end(`\n\tHTTP/1.1 400 Bad Request\r\n\t${err}\r\n`);
    });

    server.on('close', (data) => {
        log(`\n\n\t\t\tServer Close Event Fired\n\t\tServer Closed\n************************************\n\t${data}\n\n`);
     });

    server.on('connect', (req, socket, header) => { 
        log(`\n\t\t\tServer Connect Event Fired`);
        log(`\n\t\tSocket Keys: ${keys(socket)}`);
        log(`\t\tHeader Keyss: ${keys(header)}\n\n`);
    });
}