const express = require('express');

const router = express.Router();
const userCtrl = require('../controllers/user');

router.post('/add_manga', userCtrl.addMangaToUser);
router.post('/remove_manga', userCtrl.removeMangaFromUser);
router.post('/update_progress', userCtrl.updateLastChapter);

module.exports = router;
