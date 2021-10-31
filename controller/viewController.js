const File = require('../models/file');
const { getFileSize } = require('../utils');

exports.getOverview = (req, res, next) => {
  res.status(200).render('overview', {
    title: 'Upload your file',
  });
};

exports.getDownloadPage = async (req, res, next) => {
  try {
    // Extract link and get file from storage send download stream
    const file = await File.findOne({ uuid: req.params.uuid });

    // Link expired
    if (!file) {
      return res.render('download', { status: 'error', title: 'File not found', message: 'Link has been expired.' });
    }

    // Link not expired
    res.status(200).render('download', {
      status: 'success',
      title: 'Download your file',
      id: req.params.uuid,
      data: {
        uuid: file.uuid,
        fileName: file.originalName,
        fileSize: getFileSize(file.size, 2),
        downloadLink: `${process.env.APP_BASE_URL}/files/download/${file.uuid}`,
      }
    });
  } catch (err) {
    res.status(500).render('error', {
      title: 'Internal server error',
      message: 'Something went wrong. Please try again later.',
    });
  }
};
