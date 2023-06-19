class Tweets {
      title;
      bodyText;
      userId;
      creationDateTime;
      tweetId;

      constructor({ title, bodyText, userId, creationDateTime, tweetId }) {
            this.title = title;
            this.bodyText = bodyText;
            this.userId = userId;
            this.creationDateTime = creationDateTime;
            this.tweetId = tweetId;
      }

      createTweet() {
            return new Promise((resolve, reject) => {

                  const tweet = new TweetsSchema({
                        title: this.title.trim(),
                        bodyText: this.bodyText.trim(),
                        userId: this.userId,
                        bodyText: this.creationDateTime,
                  });

                  try {
                        const dbTweet = tweet.Save();
                        return resolve(dbTweet);
                  } catch (error) {
                        return reject(error);
                  }
            })
      }

      static getTweets(offset, followerUserId) {
            console.log(constants, 'constants');
            return new Promise(async (resolve, reject) => {
                  try {
                        const dbTweets = await TweetsSchema.aggregate([
                              //sort , pagination
                              //added get tweets for feed scenario , the normal get tweets will not work
                              { $match: { userId: { $in: followerUserId } } },
                              { $sort: { creationDateTime: -1 } },
                              {
                                    $facet: {
                                          data: [{ "$skip": parseInt(offset) }, { "$limit": constants.TWEETS_LIMIT }]
                                    }
                              }
                        ]);
                        console.log(dbTweets);
                        return resolve(dbTweets[0].data);
                  } catch (error) {
                        return reject(error);
                  }
            })

      }

      static getAllTweetsByUsername(offset, userId) {
            console.log(constants, 'constants');
            return new Promise(async (resolve, reject) => {
                  try {
                        const dbTweets = await TweetsSchema.aggregate([
                              //sort , pagination, userId
                              { $match: { userId: userId } },
                              { $sort: { creationDateTime: -1 } },
                              {
                                    $facet: {
                                          data: [{ "$skip": parseInt(offset) }, { "$limit": constants.TWEETS_FOR_USER_LIMIT }]
                                    }
                              }
                        ]);
                        console.log(dbTweets);
                        return resolve(dbTweets[0].data);
                  } catch (error) {
                        return reject(error);
                  }
            })

      }

      getTweetByTweetId() {
            return new Promise(async (resolve, reject) => {
                  try {
                        const singleTweet = await TweetsSchema.findOne({ _id: this.tweetId });
                        return resolve(singleTweet);
                  } catch (error) {
                        return reject(error);
                  }
            })
      }

      editTweet() {
            return new Promise(async (resolve, reject) => {

                  let newTweetdata = {};

                  if (this.title) {
                        newTweetdata.title = this.title;
                  }

                  if (this.bodyText) {
                        newTweetdata.bodyText = this.bodyText;
                  }

                  try {
                        const oldTweetData = await TweetsSchema.findOneAndUpdate({ _id: this.tweetId }, newTweetdata);
                        return resolve(oldTweetData);
                  } catch (error) {
                        return reject(error);
                  }
            })
      }

      deleteTweet() {
            return new Promise(async (resolve, reject) => {

                  let newTweetdata = {};

                  if (this.title) {
                        newTweetdata.title = this.title;
                  }

                  if (this.bodyText) {
                        newTweetdata.bodyText = this.bodyText;
                  }

                  try {
                        const tweetData = await TweetsSchema.findOneAndDelete({ _id: this.tweetId });
                        return resolve(tweetData);
                  } catch (error) {
                        return reject(error);
                  }
            })
      }


}