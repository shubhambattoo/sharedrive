const express = require('express');
const { getOverview, getDownloadPage } = require('../controller/viewController');
const router = express.Router();

router.get('/', getOverview);
router.get('/download/:uuid', getDownloadPage);

module.exports = router;