const uuid = require("uuid/v4");
const request = require("../client/Client");
const UM = require("./UserManager");

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
    constructor() {
        this.methods = [];
        this.objects = [];
        this.strings = [];
    }

    listMethods = () => this.methods;

    listObjects = () => this.objects;

    listStrings = () => this.strings;

    set = (name, obj) => {
        if (isMethod(obj) && isString(name)) {
            this.methods.push({
                id: uuid(),
                type: typeof obj,
                name: name,
                method: obj,
            });
        } else if (isObject(obj) && isString(name)) {
            this.objects.push({
                id: uuid(),
                type: typeof obj,
                name: name,
                object: obj,
            });
        } else if (isString(obj) && isString(name)) {
            this.strings.push({
                id: uuid(),
                type: typeof obj,
                name: name,
                value: obj,
            });
        }
    };

    get = name => {
        let index = this.methods.findIndex(x => x.name == name);

        if (index != -1) {
            return this.methods[index];
        } else {
            index = this.objects.findIndex(x => x.name == name);

            if (index != -1) {
                return this.objects[index];
            } else {
                index = this.strings.findIndex(x => x.name == name);

                if (index != -1) {
                    return this.strings[index];
                }
            }
        }

        return null;
    };

    toString = () => `My Application`;
}

module.exports = MA;
