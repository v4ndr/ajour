/* eslint-disable no-console */
const scrapers = require('./scrapers');
const Mangas = require('../models/Mangas');

const updateReleaseDate = async (mangaName) => {
  const releaseDate = await scrapers[mangaName].releaseDate();
  let dbReleaseDate = await Mangas.getInfos(mangaName).then((infos) => infos.dateOfNextCh);
  dbReleaseDate = new Date(dbReleaseDate);
  console.log(releaseDate > dbReleaseDate);
  return releaseDate;
};
module.exports = updateReleaseDate;
