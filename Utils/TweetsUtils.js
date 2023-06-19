const { listUsersYouFollowed } = require('../Models/Follow');
const constants = require('../Utils/constants');

async function getFeedFollowingList(followerUserId) {
      const followedUserIds = [];
      const temp = [];
      let offset = 0;
      do {
            temp = await listUsersYouFollowed({ followerUserId, offset, limit: constants.FEED_FOLLOW_LIMIT });
            offset += temp.length;
            followedUserIds = [...followedUserIds, ...temp];
      } while (temp.length < constants.FEED_FOLLOW_LIMIT);

      return followedUserIds;
};

module.exports = { getFeedFollowingList };