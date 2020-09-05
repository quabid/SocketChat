const {
    timeUtils: {
        dtStamp
    }
} = require('./utils');

class User {    
    constructor(userData = {fname, lname, email, pwd}) {
        this.firstName = userData.fname;
        this.lastName = userData.lname;
        this.email = userData.email;
        this.userName = `${this.firstName.substring(0, 2)}${this.lastName}`;
        this.password = userData.pwd;
        this.created = dtStamp();
        this.authenticated = false;
        this.token = null;
    }

    getFirstName = () => this.firstName;

    getLastName = () => this.lastName;

    getUserName = () => this.userName;

    getEmail = () => this.email;

    getPassword = () => this.password;

    getCreationDate = () => this.created;

    getToken = () => this.token;

    setAuthentication = (auth) => this.authenticated = auth;

    setToken = (token) => this.token = token;

    isAuthenticated = () => this.authenticated;

    toString = () =>  `${this.email}`;
}

module.exports = User;