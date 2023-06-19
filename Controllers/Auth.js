const express = require('express');
const { cleanUpAndValidate, generateVerificationToken, sendVerificationEmail, isAuth } = require('../Utils/AuthUtils');
const User = require('../Models/User');
const constants = require('../Utils/constants');
const authRouter = express.Router();

authRouter.post('/login', async (req, res) => {
      const { loginId, password } = req.body;
      if (!loginId || !password) {
            return res.send({
                  status: 401,
                  message: "Missing Parameters",
                  data: req.body
            })
      }
      try {
            const dbUser = await User.loginUser({ loginId, password });

            req.session.isAuth = true;
            req.session.user = {
                  email: dbUser.email,
                  username: dbUser.username,
                  name: dbUser.name,
                  userId: dbUser._id
            }
            return res.send({
                  status: 200,
                  message: "login successful",
                  data: dbUser
            })
      } catch (error) {
            return res.send({
                  status: 401,
                  error: error,
                  message: "Error in login",
            })
      }

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

authRouter.post('/logout', isAuth, (req, res) => {
      const userData = req.session.user;
      req.session.destroy(error => {
            if (error) {
                  return res.send({
                        status: 404,
                        message: "Logout Failed. Try Again.",
                        error: error
                  })
            }
            return res.send({
                  status: 200,
                  message: "Logout Successful. SEE U SOON.",
                  data: userData
            })
      })
});

module.exports = authRouter;