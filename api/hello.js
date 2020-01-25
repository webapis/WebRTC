/* eslint-disable no-undef */

const MongoClient = require('mongodb').MongoClient;
const url =
  'mongodb+srv://demoadmin:demoadmin@democluster-k12ir.mongodb.net/test?retryWrites=true&w=majority';
const dbName = 'demo';
module.exports = (req, res) => {
  const client = new MongoClient(url, { useUnifiedTopology: true });
  // Use connect method to connect to the Server
  client.connect(function(err) {
    console.log('Mongo Error', err);
    console.log('Connected successfully to server');

    const db = client.db(dbName);
    db.collection('users').insertOne({
      password: 'new pass',
      email: 'webapis.github@gmail.com'
    });
    //  client.close();
    const { name = 'World' } = req.query;
    setTimeout(() => {
      res.status(200).send(`Hello ${name}!`);
    }, 10000);
  });
};
