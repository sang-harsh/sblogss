const express = require('express');
const { cleanUpAndValidate, generateVerificationToken, sendVerificationEmail } = require('../Utils/AuthUtils');
const User = require('../Models/User');
const authRouter = express.Router();

authRouter.post('/login', (req, res) => {
      res.send('login');

});

authRouter.post('/register', async (req, res) => {
      const { username, email, name, password, phone } = req.body;
      try {
            cleanUpAndValidate({ username, email, name, password, phone });
      } catch (error) {
            return res.send({
                  status: 401,
                  message: error,
                  data: req.body
            })
      }
      //verifing if it is existing user
      try {
            await User.verifyUserNameAndEmailExists({ username, email, phone });
      } catch (error) {
            return res.send({
                  status: 401,
                  message: error,
                  data: req.body
            })
      }

      //Create and store the user in db
      const user = new User({ username, email, name, password, phone });
      try {
            const dbUser = await user.registerUser();
            return res.send({
                  status: 200,
                  message: "registration successful",
                  data: req.body
            })
      } catch (error) {
            return res.send({
                  status: 401,
                  error: error,
                  message: "Error in DB call",
                  data: req.body
            })
      }


});

authRouter.post('/logout', (req, res) => {
      res.send('logout');
});

module.exports = authRouter;