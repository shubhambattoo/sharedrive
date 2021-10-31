const express = require('express');
const { saveFile, getFile } = require('../controller/files');
const router = express.Router();

router.post('/', saveFile);
router.get('/:uuid', getFile);

module.exports = router;
