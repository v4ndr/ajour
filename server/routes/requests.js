const express = require('express');

const router = express.Router();
const requestsCtrl = require('../controllers/requests');

router.post('/', requestsCtrl.add);
router.delete('/', requestsCtrl.remove);

module.exports = router;
