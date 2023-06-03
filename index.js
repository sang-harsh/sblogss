// Package Imorts
const express = require('express');
const session = require('express-session');
const mongoDbSession = require('connect-mongodb-session')(session);

// File Imports
const constants = require('./private_constants');
const db = require('./db');


//Controllers
const AuthRouter = require('./Controllers/Auth');

const app = express();

const store = new mongoDbSession({
      uri: constants.MONGOURI,
      collection: 'tb_session'
});


//Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(session({
      secret: constants.SESSIONSECRETKEY,
      resave: false,
      saveUninitialized: false,
      store: store
}));

app.use('/auth', AuthRouter);

app.get('/', (req,res) => {
      res.send({
            status: 200,
            message: "Welcome"
      });
});

module.exports = app;

// app.listen(3000, () => {
//       console.log(`Listening to port${3000}`);
// });

