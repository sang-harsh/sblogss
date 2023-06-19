const validator = require('validator');

function cleanUpAndValidate({ username, email, name, password, phone }) {
      return new Promise((resolve, reject) => {
            try {
                  if (!(name && username && email && password && phone)) {
                        return reject('Missing parameters');
                  }

                  if (!validator.isEmail(email)) {
                        return reject('Invalid Email');
                  }

                  if (!validator.isAlphanumeric(password)) {
                        return reject('Invalid password');
                  }

                  if (phone && phone.length !== 10) {
                        return reject('Invalid phone');
                  }
                  return resolve();
            } catch (error) {
                  return reject('Not valid');
            }

      });
};

//Auth middleware
const isAuth = (req, res, next) => {
      if (req.session.isAuth) {
            next();
      } else {
            return res.send({
                  status: 404,
                  message: "Invalid User Session",
                  error: "Login please"
            })
      }

}

//JWT trial
function generateVerificationToken({ username, email, name, password, phone }) {
      return new Promise((resolve, reject) => {
            if (!(name && username && email && password)) {
                  return reject('Missing parameters');
            }
      });
};

//JWT trial
function sendVerificationEmail({ username, email, name, password, phone }) {
      return new Promise((resolve, reject) => {
            if (!(name && username && email && password)) {
                  return reject('Missing parameters');
            }
      });
};
module.exports = { cleanUpAndValidate, generateVerificationToken, isAuth, sendVerificationEmail };