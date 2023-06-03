const express = require('express');
//const isAuth = require('./middleware');
//const { cleanUpAndValidate, generateVerificationToken, sendVerificationEmail } = require('../Utils/AuthUtils');
//const UserModel = require('../Models/UserModel');
//const bycrypt = require('bycrypt');
//const validator = require('validator');

const authRouter = express.Router();

// authRouter.post('/', (req, res) => {
//       res.send('Authentication');

// });

authRouter.post('/login', (req, res) => {
      res.send('login');

});

authRouter.post('/register', (req, res) => {
      res.send('register');
});

authRouter.post('/logout', (req, res) => {
      res.send('logout');
});

module.exports = authRouter;