/* eslint-disable no-shadow */
/* eslint-disable no-restricted-syntax */
const Users = require('../models/Users');

exports.addMangaToUser = async (req, res) => {
  const { username, manga } = req.body;
  if (!username || !manga) {
    res.status(400).json({ error: 'Missing username or manga' });
  } else {
    Users.addMangaToUser(username, manga)
      .then(() => res.status(200).json(`<${manga}> added to <${username}>`))
      .catch((err) => res.status(400).json(`error when adding manga to user : ${err.message}`));
  }
};

exports.removeMangaFromUser = async (req, res) => {
  const { username, manga } = req.body;
  if (!username || !manga) {
    res.status(400).json({ error: 'Missing username or manga' });
  } else {
    Users.removeMangaFromUser(username, manga)
      .then(() => res.status(200).json(`<${manga}> removed from <${username}>`))
      .catch((err) => res.status(400).json(`error when removing manga from user : ${err.message}`));
  }
};

exports.updateLastChapter = async (req, res) => {
  const { username, manga, lastChapter } = req.body;
  if (!username || !manga || !lastChapter) {
    res.status(400).json({ error: 'Missing username, manga or lastChapter' });
  } else {
    Users.updateLastChapter(username, manga, lastChapter)
      .then(() => res.status(200).json(`lastCh of <${manga}> updated to <${lastChapter}> for <${username}>`))
      .catch((err) => res.status(400).json(`error when updating lastCh of <${manga}> in <${username}> : ${err.message}`));
  }
};
