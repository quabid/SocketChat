const uuid = require("uuid/v4");
const request = require("../client/Client");

const { log, table } = require("./Logger");

const {
    objectUtils: { stringify, parser, objsize, isObject },
    methodUtils: { isMethod },
    stringUtils: { strsize, isString, truncate },
    messageUtils: {
        fyi,
        informationMessage,
        errorMessage,
        successMessage,
        warningMessage,
    },
} = require("./utils");

class MA {
    constructor(name = null) {
        this.name = name;
        this.methods = [];
    }

    addMethod = (name, method) => {
        try {
            if (isString(name) && isMethod(method)) {
                const newId = uuid();
                this.methods.push({
                    name: name,
                    execute: method,
                    id: newId,
                    keys: stringify({
                        name: typeof name,
                        execute: typeof method,
                        id: typeof newId,
                    }),
                });
            } else {
                const msg = warningMessage("Missing and/or bad parameter(s)");
                log(msg);
            }
        } catch (err) {
            log({
                message: err.message,
                cause: err.stack,
            });
        }
    };

    removeMethod = name => {
        try {
            this.methods = this.methods.filter(method => method.name != name);
        } catch (err) {
            log({
                message: err.message,
                cause: err.stack,
            });
        }
    };

    executeMethod = (name, params = null) => {
        try {
            return this.methods.find(x => x.name == name).execute(params);
        } catch (err) {
            log({
                message: err.message,
                cause: err.stack,
            });
        }
    };

    getMethod = name => this.methods.find(x => x.name == name) || null;

    listMethods = () => this.methods;

    showMethods = () => log(this.methods);

    toString = () => this.name || `My Application`;
}

module.exports = MA;
