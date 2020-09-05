const bcrypt = require('bcryptjs');
const User = require('../custom_modules/User');
const {
    log,
    table
} = require('./Logger');

const {
    objectUtils: {
        isObject,
        stringify
    },
    stringUtils: {
        isString
    },
    methodUtils: {
        isMethod
    },
    messageUtils: {
        fyi
    }
} = require('./utils');

class UserManager {
    constructor() {
        this.users = [];
    }

    userExists = (user) => {
        if (isString(user)) {
            return (this.users.findIndex(x => x.getEmail() == user) !== -1);
        } else if (isObject(user)) {
            return (this.users.findIndex(x => x.getEmail() == user.email || x.getEmail() == user.getEmail()) !== -1);
        }
    }

    findIndex = (user) => this.users.findIndex(x => x.getEmail() == user ||
        x.getEmail() == user.email ||
        x.getUserName() == user ||
        x.getUserName() == user.username);

    find = (user) => this.users[this.findIndex(user)] || null;

    add = (user, cb = null) => {
        if (null === (this.find(user))) {
            this.users.push(new User(user));
            if (isMethod(cb)) {
                cb(null, { status: `User ${user.fname} ${user.lname} added successfully` });
            } else {
                return new Promise((resolve, reject) => {
                    resolve({
                        status: `User ${user.fname} ${user.lname} added successfully`,
                        user: this.find(user.email)
                    });
                });
            }
        } else {
            if (isMethod(cb)) {
                cb({ status: `Email ${user.email} is already registered` }, null);
            } else {
                return new Promise((resolve, reject) => {
                    reject({ status: 'failure', cause: `Email ${user.email} is already registered` });
                });
            }
        }
    }

    remove = (user, cb = null) => {
        if (null !== (this.find(user))) {
            this.users.pop(this.findIndex(user));

            if (isMethod(cb)) {
                cb({ status: `User ${user.email} removed` });
            } else {
                return new Promise((resolve, reject) => {
                    resolve({ status: `User ${user.email} removed` });
                });
            }
        } else {
            if (isMethod(cb)) {
                cb({ status: `User ${user.email} does not exist` });
            } else {
                return new Promise((resolve, rject) => {
                    reject({ status: `User ${user.email} does not exist` });
                });
            }
        }
    }

    list(cb = null) {
        if (isMethod(cb)) {
            if (this.users.length > 0) {
                cb(null, { status: 'success', users: this.users });
            } else {
                cb({ status: 'failure', cause: 'No users' }, null);
            }
        } else {
            return new Promise((resolve, reject) => {
                if (this.users.length > 0) {
                    resolve({ status: 'success', users: this.users });
                } else {
                    reject({ status: 'failure', cause: 'No users' });
                }
            });
        }
    }

    authenticate = (pwd1, pwd2) => {
        // log(fyi(`\tabout to compare the passwords via bcryptjs\n`));

        return new Promise((resolve, reject) => {
            bcrypt.compare(pwd1, pwd2, (err, isMatch) => {
                if (err) throw err;

                if (isMatch) {
                    log(fyi(`\tthe passwords match\n`));
                    resolve({ status: 'success' });
                } else {
                    log(fyi(`\tthe passwords don't match\n`));
                    reject({ status: 'failure', cause: 'Authentication Failed' });
                }
            });
        });
    }

    /* authenticate = (pwd1, pwd2) => {
        return new Promise((resolve, reject) => {
            bcrypt.compare(pwd1, pwd2, (err, isMatch) => {
                if (err) throw err;

                if (isMatch) {
                    resolve({ status: 'success' });
                } else {
                    reject({ status: 'failure', cause: 'Authentication Failed' });
                }
            });
        });
    } */

    signin = (uoe, pwd) => {
        // log(fyi(`\treceived user credentials from server\n\tabout to validate this data\n`));

        return new Promise((resolve, reject) => {
            // log(fyi(`\tfirst will look for the user in the data store\n`));

            let user = null;
            if (null !== (user = this.find(uoe))) {
                // log(fyi(`\tfound the user: ${uoe}\n\tnow will check the passwords match or not\n`));

                this
                    .authenticate(pwd, user.getPassword())
                    .then(data => {
                        user.setAuthentication(true);
                        data['user'] = user;
                        // log(fyi(`\tWill set this user cookie: ${stringify(data)}\n`));
                        resolve(data);
                    })
                    .catch(err => {
                        log(err);
                        reject({ status: 'failure', cause: 'Athentication Failed' })
                    });
            } else {
                log(`\n\tUser ${uoe} does not exist\n`);
                reject({ status: 'failure', cause: `Invalid username or password` })
            }
        });
    }

   /*  signin = (req, uoe, pwd) => {
        return new Promise((resolve, reject) => {
            let user = null;
            if (null !== (user = this.find(uoe))) {
                this
                    .authenticate(pwd, user.getPassword())
                    .then(data => {
                        user.setAuthentication(true);
                        req.user = user;
                        resolve(data);
                    })
                    .catch(err => {
                        if (req.user) {
                            if (req.user.getEmail() == uoe || req.user.getUserName() == uoe) {
                                req.user = null;
                            }
                        }
                        reject({ status: 'failure', cause: 'Athentication Failed' })
                    });
            } else {
                log(`\n\tUser ${uoe} does not exist\n`);
                reject({ status: 'failure', cause: `Invalid username or password` })
            }
        });
    } */

    toString = () => `User Manager`;
}

const UManager = new UserManager();

module.exports = UManager;