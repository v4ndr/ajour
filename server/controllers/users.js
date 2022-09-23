/* eslint-disable no-shadow */
/* eslint-disable no-restricted-syntax */
const Users = require('../models/Users');

exports.add = async (req, res) => {
  const { username } = req.params;
  const { manga } = req.body;
  if (!username || !manga) {
    res.status(400).json({ error: 'Missing username or manga' });
  } else {
    Users.addManga(username, manga)
      .then(() => res.status(200).json(`<${manga}> added to <${username}>`))
      .catch((err) => res.status(400).json(`error when adding manga to user : ${err.message}`));
  }
};

exports.remove = async (req, res) => {
  const { username } = req.params;
  const { manga } = req.body;
  if (!username || !manga) {
    res.status(400).json({ error: 'Missing username or manga' });
  } else {
    Users.removeManga(username, manga)
      .then(() => res.status(200).json(`<${manga}> removed from <${username}>`))
      .catch((err) => res.status(400).json(`error when removing manga from user : ${err.message}`));
  }
};

exports.updateProgress = async (req, res) => {
  const { username } = req.params;
  const { manga, progress } = req.body;
  if (!username || !manga || !progress) {
    res.status(400).json({ error: 'Missing username, manga or progress' });
  } else {
    Users.updateProgress(username, manga, progress)
      .then(() => res.status(200).json(`lastCh of <${manga}> updated to <${progress}> for <${username}>`))
      .catch((err) => res.status(400).json(`error when updating lastCh of <${manga}> in <${username}> : ${err.message}`));
  }
};
