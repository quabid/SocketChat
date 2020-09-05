const {
    timeUtils: {
        dtStamp
    }
} = require('./utils');

class Archive {
    constructor(name = { fname: 'firstname', lname: 'lastname' }, email = 'email@user.net', message = 'Dummy message') {
        this.username = name;
        this.contact = email;
        this.body = message;
        this.created = dtStamp();
    }

    getUser() {
        return this.user;
    }
    
    getContact() {
        return this.contact;
    }
    
    getBody() {
        return this.body;
    }
    
    getCreated() {
        return this.created;
    }

    toString() { return `${this.user.fname} ${this.user.lname}` }
}

module.exports = Archive;