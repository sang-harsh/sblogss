const express = require('express');
const FollowRouter = express.Router();

const { isAuth } = require('../Utils/AuthUtils');
const { validateMongoDbUserId } = require('../Utils/FollowUtils');
const User = require('../Models/User');
const { followNow, listUsersYouFollowed, listFollowers, unfollowUser } = require('../Models/Follow');
const constants = require('../Utils/constants');

FollowRouter.post('/follow-user', isAuth, async (req, res) => {

      const followerUserId = req.session.user.userId;
      const followedUserId = req.body.userId;

      // if user follows himself
      if (followerUserId === followedUserId) {
            return res.send({
                  status: 400,
                  message: "you cannot follow yourself"
            })
      }

      //Check IDs are Vaild - check if MongoDB id
      if (!validateMongoDbUserId(followedUserId)) {
            return res.send({
                  status: 400,
                  message: "Invalid User Id"
            })
      };

      try {
            //check if user exists
            const userDb = await User.verifyUserIdExists(followedUserId);
            if (!userDb) {
                  return res.send({
                        status: 401,
                        error: error,
                        message: "No user Found",
                  })
            }


            // below fn does 2 things - check if user existsa and is user is currently following the user
            const followData = await followNow({ followerUserId, followedUserId });

            return res.send({
                  status: 200,
                  message: "Follow successful",
                  body: followData
            })

      } catch (error) {
            return res.send({
                  status: 400,
                  message: "Failed to Follow . try again",
                  error: error
            })
      }

      //create entry in DB

      const creationDateTime = new Date();
});

FollowRouter.get('/following-list/:userId', isAuth, async (req, res) => {

      const followerUserId = req.params;

      //Check IDs are Vaild - check if MongoDB id
      if (!validateMongoDbUserId(followerUserId)) {
            return res.send({
                  status: 400,
                  message: "Invalid User Id"
            })
      };

      try {
            //check if user exists
            const userDb = await User.verifyUserIdExists(followerUserId);
            if (!userDb) {
                  return res.send({
                        status: 401,
                        error: error,
                        message: "No user Found",
                  })
            }

            const offset = req.query.offset || 0;
            // below fn does 2 things - check if user existsa and is user is currently following the user
            const listOfUsersYouFollowed = await listUsersYouFollowed({ followerUserId, offset, limit: constants.FOLLOWED_ACCOUNTS_LIST_LIMIT });

            return res.send({
                  status: 200,
                  message: "received listOfUsersYouFollowed successful",
                  body: listOfUsersYouFollowed
            })

      } catch (error) {
            return res.send({
                  status: 400,
                  message: "Failed to listOfUsersYouFollowed . try again",
                  error: error
            })
      }
});

FollowRouter.get('/follower-list/:userId/:offset', isAuth, async (req, res) => {

      const { followedUserId, offset } = req.params;

      //Check IDs are Vaild - check if MongoDB id
      if (!validateMongoDbUserId(followedUserId)) {
            return res.send({
                  status: 400,
                  message: "Invalid User Id"
            })
      };

      try {
            //check if user exists
            const userDb = await User.verifyUserIdExists(followedUserId);
            if (!userDb) {
                  return res.send({
                        status: 401,
                        error: error,
                        message: "No user Found",
                  })
            }

            //const offset = req.query.offset || 0;
            // below fn does 2 things - check if user existsa and is user is currently following the user
            const listOfFollowers = await listFollowers({ followedUserId, offset, limit: constants.FOLLOWERS_LIST_LIMIT });

            return res.send({
                  status: 200,
                  message: "received listOfUsersYouFollowed successful",
                  body: listOfFollowers
            })

      } catch (error) {
            return res.send({
                  status: 400,
                  message: "Failed to listOfUsersYouFollowed . try again",
                  error: error
            })
      }
});

FollowRouter.post('/unfollow-user', isAuth, async (req, res) => {
      const followerUserId = req.session.user.userId;
      const followedUserId = req.body.userId;

      //Check IDs are Vaild - check if MongoDB id
      if (!validateMongoDbUserId(followedUserId)) {
            return res.send({
                  status: 400,
                  message: "Invalid User Id"
            })
      };

      try {
            const unfollowData = await unfollowUser(followedUserId, followerUserId);

            return res.send({
                  status: 200,
                  message: "unfollow successful",
                  body: unfollowData
            })

      } catch (error) {
            return res.send({
                  status: 400,
                  message: "unfollow Failed  . try again",
                  error: error
            })
      }
});

module.exports = FollowRouter;