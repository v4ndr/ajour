/* eslint-disable no-console */
const scrapers = require('./scrapers');
const Mangas = require('../models/Mangas');

const updateChaps = async (mangaName) => {
  const newChaps = [];
  let utd = false; let i = 0;
  const dbLastCh = await Mangas.getLastCh(mangaName);
  const scrapedChaps = await scrapers[mangaName].chaps();
  while (!utd) {
    if (dbLastCh.chapter !== scrapedChaps[i].chapter) {
      newChaps.push(scrapedChaps[i]);
      i += 1;
    } else {
      utd = true;
    }
  }

  if (newChaps.length > 0) {
    const result = await Mangas.updateChaps(mangaName, newChaps);
    return result;
  }
  return 'no new chapters';
};

module.exports = updateChaps;
