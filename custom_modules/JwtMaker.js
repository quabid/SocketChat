require('dotenv').config();
const jwt = require('jsonwebtoken');
const {
    JWT_SECRET
} = require('../config/index');

module.exports = {
    tokenizer: (obj,cb) => {
        jwt.sign(obj, JWT_SECRET, (err, token) => {
            if (err) {
                cb(err, null);
            } else {
                cb(null, token);
            }
        });
    },
    decoderizer: (token, cb) => {
        jwt.verify(token, JWT_SECRET, (err, decoded) => {
            if (err) {
                cb(err, null);
            } else {
                cb(null, decoded);
            }
        });
    }
};

/* jwt.sign({ foo: 'bar' }, privateKey, { algorithm: 'RS256' }, function (err, token) {
    console.log(token);
}); 

jwt.verify(token, 'shhhhh', function(err, decoded) {
  console.log(decoded.foo) // bar
});

obj = {
        default: {
            title: 'JSON Web Token Secret',
            created: new Date(),
            exp: Math.floor(Date.now() / 1000) + (60 * 60),
        }

*/