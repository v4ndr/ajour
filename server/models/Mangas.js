const connection = require('./connection');

class Mangas {
  static async getMangaInfos(mangaName) {
    const db = connection.getDb();
    const [mangaInfos] = await db.collection('mangas').find({ name: { $eq: mangaName } }, { projection: { _id: 0 } }).toArray();
    return mangaInfos;
  }

  static async getAllMangasNames() {
    const db = connection.getDb();
    const mangas = await db.collection('mangas').find({}).toArray();
    return mangas.map((manga) => manga.name);
  }
}

module.exports = Mangas;
