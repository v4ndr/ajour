const express = require('express');

const router = express.Router();
const usersCtrl = require('../controllers/users');

router.post('/:username/mangas', usersCtrl.addManga);
router.delete('/:username/mangas', usersCtrl.removeManga);
router.put('/:username/progress', usersCtrl.updateProgress);

module.exports = router;
