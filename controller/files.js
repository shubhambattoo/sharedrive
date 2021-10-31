const multer = require('multer');
const path = require('path');
const File = require('../models/file');
const { v4: uuidv4 } = require('uuid');

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueName = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

let upload = multer({ storage, limits: { fileSize: 1000000 * 100 } }).single(
  'file'
); // multer middleware

exports.saveFile = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(500).send({ status: 'error', message: err.message });
    }
    const file = new File({
      filename: req.file.filename,
      originalName: req.file.originalname,
      uuid: uuidv4(),
      path: req.file.path,
      size: req.file.size,
    });
    const response = await file.save();
    res.json({ status: 'success', file: `${process.env.APP_BASE_URL}/download/${response.uuid}` });
  });
};

exports.getFile = async (req, res) => {
  try {
    const file = await File.findOne({ uuid: req.params.uuid });
    // Link expired
    if (!file) {
      return res.status(400).json({
        status: 'error',
        message: 'Link has been expired.',
      });
    }
    return res.status(200).json({
      status: 'success',
      data: {
        uuid: file.uuid,
        fileName: file.filename,
        fileSize: file.size,
        downloadLink: `${process.env.APP_BASE_URL}/files/download/${file.uuid}`,
      },
    });
  } catch (err) {
    return res.status(400).json({
      status: 'error',
      message: 'Something went wrong.',
    });
  }
};
