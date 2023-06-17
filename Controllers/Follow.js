const express = require('express');
const FollowRouter = express.Router();

const { validateMongoDbUserId } = require('../Utils/FollowUtils');
const User = require('../Models/User');
const { followNow } = require('../Models/Follow');

FollowRouter.post('/follow-user', async (req, res) => {

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
      if (validateMongoDbUserId(followedUserId)) {
            return res.send({
                  status: 400,
                  message: "Invalid User Id"
            })
      };

      try {
            //check if user exists
            const userDb = await User.verifyUserIdExists({ _id: followedUserId });
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
            res.send({
                  status: 400,
                  message: "Failed to Follow . try again",
                  error: error
            })
      }

      //create entry in DB

      const creationDateTime = new Date();
});

module.exports = FollowRouter;