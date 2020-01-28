const MongoClient = require('mongodb').MongoClient;
const url =
  'mongodb+srv://demoadmin:demoadmin@democluster-k12ir.mongodb.net/test?retryWrites=true&w=majority';
const dbName = 'demo';
module.exports = async function getDb(cb) {
  try {
    const client = await MongoClient.connect(url);
    const db = await client.db(dbName);
    cb(null, db);
  } catch (error) {
    cb(error, null);
  }
};
