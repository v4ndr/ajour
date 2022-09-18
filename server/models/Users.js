const connection = require('./connection');

class Users {
  static async getUserInfos(username) {
    const db = connection.getDb();
    const userInfos = await db.collection('users').find({ name: { $eq: username } }, { projection: { _id: 0 } }).toArray();
    if (userInfos.length === 0) {
      throw new Error(`user <${username}> not found`);
    }
    return userInfos[0];
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

  static async addMangaToUser(username, manga) {
    const db = connection.getDb();
    const key = `mangas.${manga}`;
    const result = await db.collection('users').updateOne({ name: username }, { $set: { [key]: { progress: 0 } } });
    if (result.matchedCount === 0) {
      throw new Error(`user <${username}> not found`);
    } else if (result.modifiedCount === 0) {
      throw new Error(`manga <${manga}> not found`);
    }
    return result;
  }

  static async removeMangaFromUser(username, manga) {
    const db = connection.getDb();
    const key = `mangas.${manga}`;
    const result = await db.collection('users').updateOne({ name: username }, { $unset: { [key]: 1 } });
    if (result.matchedCount === 0) {
      throw new Error(`user <${username}> not found`);
    } else if (result.modifiedCount === 0) {
      throw new Error(`manga <${manga}> not found`);
    }
    return result;
  }

  static async updateProgress(username, manga, progress) {
    const db = connection.getDb();
    const key = `mangas.${manga}.progress`;
    const result = await db.collection('users').updateOne({ name: username }, { $set: { [key]: progress } });
    if (result.matchedCount === 0) {
      throw new Error('user not found');
    } else if (result.modifiedCount === 0) {
      throw new Error(`manga <${manga}> not found`);
    }
    return result;
  }
}

module.exports = Users;
