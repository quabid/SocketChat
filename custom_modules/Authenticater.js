const bcrypt = require('bcryptjs');

module.exports.authenticate = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await User.findOne({ email });
            // Match Password 
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err) throw err;

                if (isMatch) {
                    resolve(user);
                } else {
                    reject('Authentication Failed');
                }
            });
        } catch (err) {
            // Email not found 
            reject('Authentication Failed');
        }
    });
};