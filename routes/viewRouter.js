const express = require('express');
const { getOverview, getDownloadPage } = require('../controller/viewController');
const router = express.Router();

router.get('/download/:uuid', getDownloadPage);
router.get('*', getOverview);

module.exports = router;
