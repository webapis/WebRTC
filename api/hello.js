/* eslint-disable no-undef */
const MongoClient = require('mongodb').MongoClient;
const url =
  'mongodb+srv://demoadmin:demoadmin@democluster-k12ir.mongodb.net/test?retryWrites=true&w=majority';
const dbName = 'demo';
module.exports = async (req, res) => {
  try {
    const client = await MongoClient.connect(url);
    const db = await client.db(dbName);
    const result = await db.collection('users').insertOne({
      password: 'new pass',
      email: 'webapis.github@gmail.com'
    });
    console.log('inser result', result);
    client.close();
  } catch (error) {
    console.log('mongodb Error');
  }
  const { name = 'World' } = req.query;

  res.status(200).send(`Hello ${name}!`);
};
