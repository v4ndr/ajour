const express = require('express');

const router = express.Router();
const loadCtrl = require('../controllers/load');

router.get('/', loadCtrl.load);

module.exports = router;
