const mongoose = require('mongoose');

function connectDb() {
  mongoose.connect(process.env.MONGODB_URI);

  const connection = mongoose.connection;

  connection.on('error', (err) => {
    console.log(err);
    console.log(
      'MongoDB connection error. Please make sure MongoDB is running.'
    );
    process.exit();
  });

  connection.once('open', () => {
    console.log('MongoDB successfully connected.');
  });
}


module.exports = connectDb;