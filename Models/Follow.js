const FollowSchema = require('../Schemas/Follow');
const constants = require('./private_constants');
const mongodb = require('mongodb');
const ObjectId = mongodb.Types.ObjectId;
const UserSchema = require('../Schemas/User');

function followNow({ followerUserId, followedUserId }) {
      return new Promise(async (resolve, reject) => {
            try {
                  //check this 
                  const followData = await FollowSchema.findOne({ followedUserId: followedUserId, followerUserId: followerUserId });
                  if (followData)
                        return reject("User Already Followwed");

                  const creationDateTime = new Data();

                  const followObj = new FollowSchema({
                        followerUserId, followedUserId, creationDateTime
                  })

                  const followResponse = await followObj.save();
                  return resolve(followResponse);
            } catch (error) {
                  return reject(error);
            }
      });
}

function listUsersYouFollowed({ followerUserId, offset, limit }) {
      return new Promise(async (resolve, reject) => {
            try {
                  //check this 
                  console.log(constants, 'constants');
                  const response = await FollowSchema.aggregate([
                        //check parseInt
                        { $match: { followerUserId } },
                        { $sort: { creationDateTime: -1 } },
                        { $project: { followedUserId: 1 } },
                        { $facet: { data: [{ "$skip": parseInt(offset) }, { "$limit": limit }] } }
                  ]);

                  //response
                  // [followedUserId : "", followedUserId: ""]
                  const followedUserIds = [];

                  response.data[0].forEach((item) => {
                        followedUserIds.push(ObjectId(item.followedUserId));
                  })
                  //followedUserIds = ["", ""]

                  const listOfUsersDataThatYouFollowed = await UserSchema.aggregate([
                        { $match: { _id: { $in: followedUserIds } } },
                        { $project: { username: 1, name: 1, _id } },
                  ])

                  return resolve(listOfUsersDataThatYouFollowed);
            } catch (error) {
                  return reject(error);
            }
      });
}

function listFollowers({ followedUserId, offset, limit }) {
      return new Promise(async (resolve, reject) => {
            try {
                  //check this 
                  console.log(constants, 'constants');
                  const listFollowersReponse = await FollowSchema.aggregate([
                        //
                        { $match: { followedUserId } },
                        { $sort: { creationDateTime: -1 } },
                        { $project: { followerUserId: 1 } },
                        { $facet: { data: [{ "$skip": parseInt(offset) }, { "$limit": limit }] } }
                  ]);

                  //listFollowersReponse
                  // [followedUserId : "", followedUserId: ""]
                  const followersUserIds = [];

                  listFollowersReponse.data[0].forEach((item) => {
                        followersUserIds.push(ObjectId(item.followedUserId));
                  })
                  //followedUserIds = ["", ""]

                  const listOfFollowers = await UserSchema.aggregate([
                        { $match: { _id: { $in: followersUserIds } } },
                        { $project: { username: 1, name: 1, _id } },
                  ])

                  return resolve(listOfFollowers);
            } catch (error) {
                  return reject(error);
            }
      });
}

function unfollowUser(followedUserId, followerUserId) {
      return new Promise(async (resolve, reject) => {
            try {
                  const unfollowData = await TweetsSchema.findOneAndDelete({ followedUserId, followerUserId });
                  if (!unfollowData) {
                        return reject("User Not followed or not present");
                  }
                  return resolve(unfollowData);
            } catch (error) {
                  return reject(error);
            }
      });
}
module.exports = { followNow, listUsersYouFollowed, listFollowers, unfollowUser };