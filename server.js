require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const port = process.env.PORT || 3000;

const corsOptions = {
  origin: process.env.ALLOWED_CLIENTS.split(','),
};
app.use(express.json({ extended: false }));
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

app.use(cors(corsOptions));

const connectDb = require('./config/db');

connectDb();

// Routes
app.use('/', require('./routes/viewRouter'));
app.use('/api/files', require('./routes/files'));
app.use('/files/download', require('./routes/download'));

app.listen(port, () => console.log(`Listening on port ${port}`));
