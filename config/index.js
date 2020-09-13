const DB_URI = `${process.env.MONGODB_URI}`;
const DB_COL = process.env.MONGO_COLLECTION;
const DB_NAME = process.env.MONGO_DB_NAME;
const DB_USER = process.env.MONGO_DB_USER_LTD;
const DB_USER_PWD = process.env.MONGO_DB_USER_LTD_PWD;

module.exports = {
  DB_URI,
  DB_COL,
  DB_NAME,
  DB_USER,
  DB_USER_PWD,
};
