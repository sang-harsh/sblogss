const express = require('express');
const Router = express.Router();
const Tweets = require('../Models/Tweets');
const tweetsRouter = express.Router();
const constants = require('../Utils/constants');
const { isAuth } = require('../Utils/AuthUtils');

tweetsRouter.post('/create-tweet', isAuth, async (req, res) => {
      const { title, bodyText } = req.body;
      const { userId } = req.session.user;

      if (!title || !bodyText || !userId) {
            return res.send({
                  status: 500,
                  message: "Parameters Missing"
            })
      }

      if (typeof (title) !== 'string' || typeof (bodyText) !== 'string') {
            res.send({
                  status: 400,
                  message: "Parameters Should be string"
            })
      }

      if (title.length > 200 || bodyText > 1000) {
            res.send({
                  status: 401,
                  message: "Parameters Too Long"
            })
      }

      const creationDateTime = new Date();

      const Tweet = new Tweets({ title, bodyText, creationDateTime, userId });

      try {
            const dbTweet = await Tweet.createTweet();

            return res.send({
                  status: 200,
                  message: "Tweet Created",
                  body: dbTweet
            })
      } catch (error) {
            res.send({
                  status: 401,
                  message: "Failed to create Tweet . try again",
                  error: error
            })
      }
});

tweetsRouter.get('/get-all-tweets', async (req, res) => {

      const offset = req.query.offset || 0;
      try {
            const allTweets = await Tweets.getTweets(offset);

            return res.send({
                  status: 200,
                  message: "allTweets read succesful",
                  body: allTweets
            })
      } catch (error) {
            res.send({
                  status: 401,
                  message: "Failed to get all tweets . Try again",
                  error: error
            })
      }
})


tweetsRouter.get('/get-tweets-for-user', isAuth, async (req, res) => {

      const offset = req.query.offset || 0;
      const { userId } = req.session.user;
      try {
            const allTweetsByUsername = await Tweets.getAllTweetsByUsername(offset, userId);

            return res.send({
                  status: 200,
                  message: "allTweetsByUsername read succesful",
                  body: allTweetsByUsername
            })
      } catch (error) {
            res.send({
                  status: 401,
                  message: "Failed to get allTweetsByUsername . Try again",
                  error: error
            })
      }
})

tweetsRouter.post('/edit-tweet', isAuth, async (req, res) => {
      //Add check for data and tweetId , return error 500 

      const { title, bodyText } = req.body.data;
      const { tweetId } = req.body;
      const userId = req.session.user.userId;
      if (!title && !bodyText) {
            return res.send({
                  status: 400,
                  message: "Parameters Missing",
                  error: "Missing title or bodytext"
            })
      }
      try {

            //Check if tweet belongs to the user
            const tweet = new Tweets({ title, bodyText, tweetId });
            const singleTweet = await tweet.getTweetByTweetId();

            //Error try toString
            if (userId !== singleTweet.userId) {
                  return res.send({
                        status: 403,
                        message: "Tweet belongs to other user",
                        error: "Not Authorised"
                  })
            }

            //Verify the creation time
            const currentDateTime = new Date();
            const creationDateTime = new Date(singleTweet.creationDateTime);
            const diff = (currentDateTime - creationDateTime.getTime()) / (1000 * 60);
            if (diff > 30) {
                  return res.send({
                        status: 403,
                        message: "Edit not allowed after 30 seconds of creation",
                        error: "Not Allowed"
                  })
            }


            //Update Tweet
            const tweetData = await tweet.editTweet();

            return res.send({
                  status: 200,
                  message: "Edit succesful",
                  body: tweetData
            })
      } catch (error) {
            res.send({
                  status: 401,
                  message: "Internal Error",
                  error: error
            })
      }
})

tweetsRouter.post('/delete-tweet', isAuth, async (req, res) => {
      //Add check for data and tweetId , return error 500

      // Add a bin functionality

      const { tweetId } = req.body;
      const userId = req.session.user.userId;

      if (!title && !bodyText) {
            return res.send({
                  status: 400,
                  message: "Parameters Missing",
                  error: "Missing title or bodytext"
            })
      }
      try {

            //Check if tweet belongs to the user
            const tweet = new Tweets({ tweetId });
            const singleTweet = await tweet.getTweetByTweetId();

            if (userId !== singleTweet.userId) {
                  return res.send({
                        status: 403,
                        message: "Tweet belongs to other user",
                        error: "Not Authorised"
                  })
            }


            //Update Tweet
            const tweetData = await tweet.deleteTweet();

            return res.send({
                  status: 200,
                  message: "Delete succesful",
                  body: tweetData
            })
      } catch (error) {
            res.send({
                  status: 401,
                  message: "Internal Error",
                  error: error
            })
      }
})


module.exports = tweetsRouter;