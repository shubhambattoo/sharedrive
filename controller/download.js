const File = require('../models/file');

exports.downloadFile = async (req, res) => {
  // Extract link and get file from storage send download stream
  const file = await File.findOne({ uuid: req.params.uuid });
  // Link expired
  if (!file) {
    return res.render('download', { error: 'Link has been expired.' });
  }
  const filePath = `${__dirname}/../${file.path}`;
  res.download(filePath);
};
