/* eslint-disable no-shadow */
/* eslint-disable no-restricted-syntax */
const Requests = require('../models/Requests');

exports.add = async (req, res) => {
  const { from, to } = req.body;
  if (!from || !to) {
    res.status(400).json({ error: 'Missing from or to' });
  } else {
    Requests.add(from, to)
      .then(() => res.status(200).json(`request from <${from}> to <${to}> added`))
      .catch((err) => res.status(400).json(`error when adding request : ${err.message}`));
  }
};

exports.remove = async (req, res) => {
  const { from, to } = req.body;
  if (!from || !to) {
    res.status(400).json({ error: 'Missing from or to' });
  } else {
    Requests.remove(from, to)
      .then(() => res.status(200).json(`request from <${from}> to <${to}> removed`))
      .catch((err) => res.status(400).json(`error when removing request : ${err.message}`));
  }
};
