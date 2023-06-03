const validator = require('validator');

function cleanUpAndValidate({ username, email, name, password, phone }) { 
      return new Promise((resolve, reject) => {
            if (!(name && username && email && password)) { 
                  reject('Missing parameters');
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