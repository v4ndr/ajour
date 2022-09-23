const connection = require('./connection');

class Users {
  static async getInfos(username) {
    const db = connection.getDb();
    const userInfos = await db.collection('users').find({ name: { $eq: username } }, { projection: { _id: 0 } }).toArray();
    if (userInfos.length === 0) {
      throw new Error(`user <${username}> not found`);
    }
    return userInfos[0];
  }

  static async check(username) {
    const db = connection.getDb();
    const userInfos = await db.collection('users').find({ name: { $eq: username } }, { projection: { _id: 0 } }).toArray();
    if (userInfos.length === 0) {
      return false;
    }
    return true;
  }

  static async search(query) {
    const db = connection.getDb();
    const re = new RegExp(`^${query}`);
    const searchResults = await db.collection('users').find({ name: { $regex: re } });
    return searchResults;
  }

  static async addManga(username, manga) {
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

  static async removeManga(username, manga) {
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
