const moment = require("moment");
const chalk = require("chalk");
const strPattern = /[a-z,A-Z,\d]+/;
const urlPattern = /^(http:\/\/).*/;
const secureUrlPattern = /^(https:\/\/).*/;
const numPattern = /[0-9]+/;

const utils = {
  objectUtils: {
    keys: (obj) => {
      if (null != obj && undefined != obj && obj instanceof Object) {
        return Object.keys(obj);
      }
      return null;
    },
    objsize: (obj) =>
      null != obj && undefined != obj ? Object.keys(obj).length : null,
    methods: (obj) => {
      if (null != obj && undefined != obj && obj instanceof Object) {
        const meths = [];
        for (let o in obj) {
          const objO = obj[o];
          if (typeof objO === "function") {
            meths.push(objO);
          }
        }
        return meths;
      }
      return null;
    },
    stringify: (obj) =>
      null != obj && undefined != obj ? JSON.stringify(obj) : null,
    parser: (strObj) => JSON.parse(strObj),
    isObject: (obj) =>
      null != obj &&
      undefined != obj &&
      obj instanceof Object &&
      !Array.isArray(obj) &&
      typeof obj === "object",
  },
  arrayUtils: {
    size: (arr) =>
      null != obj && undefined != obj && Array.isArray(obj) ? arr.length : null,
    filter: (arr, f) => {
      if (null != arr && undefined != arr && Array.isArray(arr)) {
        return arr.filter((item) => {
          if (item == f) {
            return item;
          }
        });
      }
    },
  },
  stringUtils: {
    strsize: (str) =>
      null != str &&
      undefined != str &&
      typeof str === "string" &&
      str.length > 0
        ? str.length
        : null,
    isString: (str) => strPattern.test(str) && typeof str === "string",
    truncate: function (str, len) {
      if (str.length > len && str.length > 0) {
        var new_str = str + " ";
        new_str = str.substr(0, len);
        new_str = str.substr(0, new_str.lastIndexOf(" "));
        new_str = new_str.length > 0 ? new_str : str.substr(0, len);
        return new_str + " ...";
      }
      return str;
    },
    stripemail: (str) =>
      /([a-zA-Z0-9]+)/.exec(/([a-zA-Z0-9]+\@)/.exec(str))[0],
  },
  numberUtils: {
    isNumber: (num) =>
      NaN != num && numPattern.test(num) && typeof num === "number"
        ? true
        : false,
  },
  methodUtils: {
    isMethod: (method) =>
      null != method && undefined != method && typeof method === "function"
        ? true
        : false,
  },
  urlUtils: {
    hasProtocol: (url) => urlPattern.test(url),
    hasSecureProtocol: (url) => secureUrlPattern.test(url),
    addProtocol: (url) => `http://${url}`,
  },
  postUtils: {
    parseData: (data) => {
      const temp = data.split("&");
      const objData = {};
      for (let t in temp) {
        const arrObj = temp[t].split("=");
        let value;
        if (arrObj[1].toString().indexOf("%40") !== -1) {
          value = `${arrObj[1].toString().split("%40")[0]}@${
            arrObj[1].toString().split("%40")[1]
          }`;
          value.replace("%40", "@");
        } else {
          value = arrObj[1];
        }
        objData[`${arrObj[0]}`] = value;
      }
      return objData;
    },
  },
  messageUtils: {
    statusMessage: (msg = "") => chalk.rgb(75, 75, 255).bold(`${msg}`),
    errorMessage: (msg = "") => chalk.rgb(255, 40, 40).bold(`${msg}`),
    successMessage: (msg = "") => chalk.rgb(44, 255, 44).bold(`${msg}`),
    warningMessage: (msg = "") => chalk.rgb(255, 255, 44).bold(`${msg}`),
    informationMessage: (msg = "") => chalk.rgb(185, 220, 250).bold(`${msg}`),
    fyi: (msg = "") => chalk.rgb(255, 194, 3).bold(`${msg}`),
  },
  timeUtils: {
    timeStamp: (date = new Date(), format = "HH:MM:SS") =>
      moment(date).format(format),
    dateStamp: (date = new Date(), format = "MMMM Do YYYY") =>
      moment(date).format(format),
    dtStamp: (date = new Date(), format = "MMMM Do YYYY HH:MM:SS") =>
      moment(date).format(format),
  },
  htmlUtils: {
    stripTags: function (input) {
      return input.replace(/<(?:.|\n)*?>/gm, "");
    },
  },
  miscUtils: {
    strAreEqual: (str1, str2) => str1 == str2 && str1 === str2,
  },
};

module.exports = utils;
