/* eslint-disable no-console */
const scrapers = require('./scrapers');

const updateReleaseDate = async (mangaName) => {
  const releaseDate = await scrapers[mangaName].releaseDate();
  return releaseDate;
};

module.exports = updateReleaseDate;
