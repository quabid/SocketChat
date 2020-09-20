const bcrypt = require("bcryptjs");
const {
  methodUtils: { isMethod },
} = require("./utils");

module.exports = {
  hashPassword: (password, cb = null) => {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(password, salt, (err, hash) => {
        if (err) {
          if (isMethod(cb)) {
            cb({ status: "failed", error: err });
          } else {
            return new Promise((resolve, reject) => {
              reject({ status: "failed", error: err });
            });
          }
        } else {
          if (isMethod(cb)) {
            cb({ status: "success", original: password, payload: hash });
          } else {
            return new Promise((resolve, reject) => {
              return resolve({
                status: "success",
                original: password,
                hashed: hash,
              });
            });
          }
        }
      });
    });
  },
  comparePassword: (pwd, hash) => {
    return new Promise(async (resolve, reject) => {
      // Match Password
      bcrypt.compare(pwd, hash, (err, isMatch) => {
        if (err) throw err;

        if (isMatch) {
          resolve({ status: "success" });
        } else {
          reject({ status: "failure" });
        }
      });
    });
  },
};
