const { MongoClient, ServerApiVersion } = require('mongodb');

let db;
const url = 'mongodb+srv://vandr:v,a,n,d,e,r@aj.3rkhucf.mongodb.net/?retryWrites=true&w=majority';

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
