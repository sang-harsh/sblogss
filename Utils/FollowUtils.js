const mongodb = require('mongodb');
const ObjectId = mongodb.Types.ObjectId;

function validateMongoDbUserId(userId) {
      if (!userId) return false;
      if (!Object.isValid(userId)) return false;
      return true;
}

module.exports = { validateMongoDbUserId };