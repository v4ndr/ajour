const connection = require('./connection');

class Mangas {
  static async getMangaInfos(mangaName) {
    const db = connection.getDb();
    const mangaInfos = await db.collection('mangas').find({ name: { $eq: mangaName } }, { projection: { _id: 0 } }).toArray();
    if (mangaInfos.length === 0) {
      throw new Error(`manga <${mangaName}> not found`);
    }
    return mangaInfos[0];
  }

  static async getAllMangasNames() {
    const db = connection.getDb();
    const mangas = await db.collection('mangas').find({}).toArray();
    if (mangas.length === 0) {
      throw new Error('no manga found in db');
    }
    return mangas.map((manga) => manga.name);
  }
}

module.exports = Mangas;
