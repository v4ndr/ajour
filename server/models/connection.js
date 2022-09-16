const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

let db;
const url = process.env.DB_URI;

module.exports = {
  connectToServer: (callback) => {
    const client = new MongoClient(
      url,
      { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 },
    );
    client.connect(async (err) => {
      db = client.db('AJdb');
      return callback(err);
    });
  },

  getDb: () => db,
};
