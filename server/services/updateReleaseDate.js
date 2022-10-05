/* eslint-disable no-console */
const scrapers = require('./scrapers');
const Mangas = require('../models/Mangas');

const updateReleaseDate = async (mangaName) => {
  let result = null;
  const releaseDate = await scrapers[mangaName].releaseDate();
  let dbReleaseDate = await Mangas.getInfos(mangaName).then((infos) => infos.dateOfNextCh);
  dbReleaseDate = new Date(dbReleaseDate);
  if (releaseDate > dbReleaseDate) {
    result = await Mangas.updateReleaseDate(mangaName, releaseDate);
  }
  return result || 'release date not updated';
};
module.exports = updateReleaseDate;
