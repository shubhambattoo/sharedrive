require('dotenv').config();
const File = require('./models/file');
const fs = require('fs');
const connectDb = require('./config/db');

connectDb()

async function fetchData() {
  const pastDate = new Date(Date.now() - (1000 * 60 * 60 * 24));
  const files = await File.find({ createdAt: { $lt: pastDate } });
  if (files.length) {
    for (const file of files) {
      try {
        fs.unlinkSync(file.path);
        await file.remove();
        console.log(`${file.filename} deleted`);
      } catch (err) {
        console.log(`error while deleting file: ${err}`);
      }
    }
  }
  console.log('Job done!');
}

fetchData().then(process.exit);