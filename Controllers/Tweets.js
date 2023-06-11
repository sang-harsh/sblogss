const express = require('express');
const Router = express.Router();
const Tweets = require('../Models/Tweets');
const tweetsRouter = express.Router();

tweetsRouter.post('/create-tweet', async (req, res) => {
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
                  message: "Failed to create Tweet . try again"
            })
      }
})

module.exports = tweetsRouter;