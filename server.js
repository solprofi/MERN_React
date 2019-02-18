const express = require('express');
const mongoose = require('mongoose');

const app = express();

const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');

//db config
const db = require('./config/keys').mongoURI;

// connect to mongoDB
mongoose
  .connect(db)
  .then(() => console.log('connected to mongoDB successfully'))
  .catch(err => console.error(err));

app.get('/', (req, res) => res.send('<h1>YAiiiii</h1>'));

//use routes
app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`server is running on port ${port}`));