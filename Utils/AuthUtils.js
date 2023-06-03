const validator = require('validator');

function cleanUpAndValidate({ username, email, name, password, phone }) { 
      console.log({ username, email, name, password, phone });
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
                  resolve();
            } catch (error) {
                  return reject('Not valid');
            }
            
      });
};

function generateVerificationToken({ username, email, name, password, phone }) { 
      return new Promise((resolve, reject) => {
            if (!(name && username && email && password)) { 
                  reject('Missing parameters');
            }
      });
};

function sendVerificationEmail({ username, email, name, password, phone }) { 
      return new Promise((resolve, reject) => {
            if (!(name && username && email && password)) { 
                  reject('Missing parameters');
            }
      });
};    
module.exports = { cleanUpAndValidate, generateVerificationToken, sendVerificationEmail };