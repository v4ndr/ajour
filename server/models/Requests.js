const connection = require('./connection');
const Users = require('./Users');

class Requests {
  static async getReceivedRequests(username) {
    const db = connection.getDb();
    const receivedRequests = await db.collection('friendsRequests').find({ to: { $eq: username } }, { projection: { _id: 0 } }).toArray();
    const requestsUsernames = receivedRequests.map((request) => request.from);
    return requestsUsernames;
  }

  static async getSentRequests(username) {
    const db = connection.getDb();
    const sentRequests = await db.collection('friendsRequests').find({ from: { $eq: username } }, { projection: { _id: 0 } }).toArray();
    const requestsUsernames = sentRequests.map((request) => request.to);
    return requestsUsernames;
  }

  static async check(from, to) {
    const db = connection.getDb();
    const result = await db.collection('friendsRequests').find({ from: { $eq: from }, to: { $eq: to } }).toArray();
    if (result.length === 0) {
      return false;
    }
    return true;
  }

  static async add(from, to) {
    const db = connection.getDb();
    let result;
    if (await Users.check(from) && await Users.check(to)) {
      if (await Requests.check(from, to)) {
        throw new Error('request already sent');
      } else {
        result = await db.collection('friendsRequests').insertOne({ from, to });
        if (!result.insertedId) {
          throw new Error('request not added');
        }
      }
    } else {
      throw new Error('user (from or to) not found');
    }
    return result;
  }

  static async remove(from, to) {
    const db = connection.getDb();
    const result = await db.collection('friendsRequests').deleteOne({ from, to });
    if (result.deletedCount === 0) {
      throw new Error(`request sfrom : <${from}>, to : <${to}> not found`);
    }
    return result;
  }
}

module.exports = Requests;
