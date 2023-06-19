function validateMongoDbUserId(userId) {
      if (!userId) return false;
      if (!Object.isValid(userId)) return false;
      return true;
}

module.exports = { validateMongoDbUserId };