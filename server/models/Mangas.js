const connection = require('./connection');

class Mangas {
  static async getInfos(mangaName) {
    const db = connection.getDb();
    const mangaInfos = await db.collection('mangas').find({ name: { $eq: mangaName } }, { projection: { _id: 0 } }).toArray();
    if (mangaInfos.length === 0) {
      throw new Error(`manga <${mangaName}> not found`);
    }
    return mangaInfos[0];
  }

  static async getAllNames() {
    const db = connection.getDb();
    const mangas = await db.collection('mangas').find({}).toArray();
    if (mangas.length === 0) {
      throw new Error('no manga found in db');
    }
    return mangas.map((manga) => manga.name);
  }

  static async getLastCh(mangaName) {
    const db = connection.getDb();
    const results = await db.collection('mangas').find({ name: { $eq: mangaName } }, { projection: { _id: 0, chaps: 1 } }).toArray();
    if (results.length === 0) {
      throw new Error(`manga <${mangaName}> not found`);
    }
    return results[0].chaps[0];
  }

  static async updateChaps(mangaName, newChaps) {
    const db = connection.getDb();
    const [results] = await db.collection('mangas').find({ name: { $eq: mangaName } }, { projection: { _id: 0, chaps: 1 } }).toArray();
    const dbChaps = results.chaps;
    const utdChaps = newChaps.concat(dbChaps);
    const result = await db.collection('mangas').updateOne({ name: mangaName }, { $set: { chaps: utdChaps } });
    if (result.matchedCount === 0) {
      throw new Error('manga not found');
    } else if (result.modifiedCount === 0) {
      throw new Error('error while updating chapters');
    }
    return `<${newChaps.length}> chpaters updated for <${mangaName}>`;
  }

  static async updateReleaseDate(mangaName, releaseDate) {
    const db = connection.getDb();
    const [releaseDateString] = releaseDate.toISOString().split('T');
    const result = await db.collection('mangas').updateOne({ name: mangaName }, { $set: { dateOfNextCh: releaseDateString } });
    if (result.matchedCount === 0) {
      throw new Error('manga not found');
    } else if (result.modifiedCount === 0) {
      throw new Error('error while updating release date');
    }
    return `release date updated for <${mangaName}>`;
  }
}

module.exports = Mangas;
