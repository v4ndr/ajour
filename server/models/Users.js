const connection = require('./connection');

class Users {
  static async getUserInfos(username) {
    const db = connection.getDb();
    const [userInfos] = await db.collection('users').find({ name: { $eq: username } }, { projection: { _id: 0 } }).toArray();
    return userInfos;
  }

  static async getReceivedFriendsRequests(username) {
    const db = connection.getDb();
    const receivedRequests = await db.collection('friendsRequests').find({ to: { $eq: username } }, { projection: { _id: 0 } }).toArray();
    const requestsUsernames = receivedRequests.map((request) => request.from);
    return requestsUsernames;
  }

  static async getSentFriendsRequests(username) {
    const db = connection.getDb();
    const sentRequests = await db.collection('friendsRequests').find({ from: { $eq: username } }, { projection: { _id: 0 } }).toArray();
    const requestsUsernames = sentRequests.map((request) => request.to);
    return requestsUsernames;
  }

  static async searchInUsers(query) {
    const db = connection.getDb();
    const re = new RegExp(`^${query}`);
    const searchResults = await db.collection('users').find({ name: { $regex: re } });
    return searchResults;
  }
}

module.exports = Users;
