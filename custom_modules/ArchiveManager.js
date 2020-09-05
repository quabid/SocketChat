const Archive = require('../custom_modules/Archive');
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
    }
} = require('./utils');

class ArchiveManager {
    constructor() {
        this.archives = [];
    }

    add = (objUser, strEmail, strMessage) => this.archives.push({
        user: objUser,
        contact: strEmail,
        body: strMessage
    });

    addArchive = (objUser, strEmail, strMessage) => {
        const archive = new Archive(objUser, strEmail, strMessage);
        const newArchive = {};
        newArchive[strEmail] = archive;
        this.archives.push(newArchive);
    }

    find = (searchArchive, cb = null) => {
        let index = -1,
            archive = null,
            found = false;
        
        if (isString(searchArchive)) {
            index = this.archives.findIndex(x => x.contact == searchArchive);
            if (index !== -1) {
                archive = this.archives[index];
                found = true;
            }
        } else if (isObject(searchArchive)) {
            for (let a in this.archives) {
                const objA = this.archives[a];
                if (searchArchive.contact === objA.contact) {
                    archive = objA;
                    found = true;
                }
            }
        } else {
            index = -1;
            archive = null;
            found = false;
        }

        if (found && archive) {
            if (isMethod(cb)) {
                cb(null, archive);
            } else {
                return new Promise((resolve, reject) => {
                    resolve(archive);
                });
            }
        } else {
            if (isMethod(cb)) {
                cb({ status: 'error', cause: 'search failed' }, null);
            } else {
                return new Promise((resolve, reject) => {
                    reject({ status: 'error', cause: 'search failed' });
                });                    
            }
        }
    }

    findArchive = (searchArchive, cb = null) => {
        if (isString(searchArchive)) {
            for (let a in this.archives) {
                const objA = this.archives[a];
                if (objA.hasOwnProperty(searchArchive)) {
                    return new Promise((resolve, reject) => {
                        resolve(objA);
                    });
                } else {
                    return new Promise((resolve, reject) => { 
                        reject({ status: 'Not Found', 'Search Term': searchArchive });
                    });
                }
            }
        } else if (isObject(searchArchive)) {
            for (let a in this.archives) {
                const objA = this.archives[a];
                if (objA.hasOwnProperty(searchArchive.contact)) {
                    return new Promise((resolve, reject) => {
                        resolve(objA);
                    });
                } else {
                    return new Promise((resolve, reject) => {
                        reject({ status: 'Not Found', 'Search Term': searchArchive });
                     });
                }
            }
        } else {
            return new Promise((resolve, reject) => {
                reject({ status: 'Invalid search parameter' });
            });
        }
    }

    remove = (searchArchive) => {
        if (isString(searchArchive)) {
            const index = this.archives.findIndex(x => x.contact == searchArchive);
            if (index === -1) {
                return new Promise((resolve, reject) => {
                    reject({ status: 'Not Found', 'Search Term': searchArchive });
                });
            } else {
                return new Promise((resolve, reject) => {
                    resolve({ status: 'Archive found and removed' });
                });
            }
        } else if (isObject(searchArchive)) {
            const index = this.archives.findIndex(x => x.contact == searchArchive.contact);
            if (index === -1) {
                return new Promise((resolve, reject) => {
                    reject({ status: 'Not Found', 'Search Term': searchArchive.contact });
                });
            } else {
                return new Promise((resolve, reject) => {
                    resolve({ status: 'Archive found and removed' });
                });
            }
        }
        return null;
    }

    list() {
        return this.archives;
    }

    toString = () => `Archive Manager`;
}

const Manager = new ArchiveManager();

module.exports = Manager;