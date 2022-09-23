const express = require('express');

const router = express.Router();
const usersCtrl = require('../controllers/users');

router.post('/:username/mangas', usersCtrl.add);
router.delete('/:username/mangas', usersCtrl.remove);
router.put('/:username/progress', usersCtrl.updateProgress);

module.exports = router;
