// Package Imorts
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const mongoDbSession = require('connect-mongodb-session')(session);

// File Imports
const constants = require('./private_constants');
const db = require('./db');


//Controllers
const AuthRouter = require('./Controllers/Auth');
const TweetsRouter = require('./Controllers/Tweets');
const FollowRouter = require('./Controllers/Follow');

const app = express();

const store = new mongoDbSession({
      uri: constants.MONGOURI,
      collection: 'tb_session'
});


//Middlewares
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }))
app.use(session({
      secret: constants.SESSIONSECRETKEY,
      resave: false,
      saveUninitialized: false,
      store: store
}));

//Routes

app.use('/auth', AuthRouter);
app.use('/tweets', TweetsRouter);
app.use('/follow', FollowRouter);

app.get('/', (req, res) => {
      return res.send({
            status: 200,
            message: "Welcome"
      });
});

module.exports = app;

