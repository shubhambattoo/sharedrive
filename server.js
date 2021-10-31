const express = require('express');
const app = express();
const path = require('path');
const port = process.env.PORT || 3000;

app.use(express.json({ extended: false }));
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

const connectDb = require('./config/db');

connectDb();

// Routes
app.use('/', require('./routes/viewRouter'));
app.use('/api/files', require('./routes/files'));
app.use('/files/download', require('./routes/download'));

app.listen(port, () => console.log(`Listening on port ${port}`));
