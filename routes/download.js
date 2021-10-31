const { downloadFile } = require('../controller/download');
const router = require('express').Router();

router.get('/:uuid', downloadFile);

module.exports = router;
