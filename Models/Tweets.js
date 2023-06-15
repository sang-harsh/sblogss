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

      static getTweets(offset) {
            return new Promise(async (resolve, reject) => {
                  try {
                        const dbTweets = await TweetsSchema.aggregate([
                              //sort , pagination
                              { $sort: { "creationDateTime": -1 } },
                              {
                                    $facet: {
                                          data: [{ "skip": parent(offset) }, { "$limit": constants.TWEETS_LIMIT }]
                                    }
                              }
                        ]);
                        console.log(dbTweets);
                        resolve(dbTweets[0].data);
                  } catch (error) {
                        return reject(error);
                  }
            })

      }

      static getAllTweetsByUsername(offset, userId) {
            return new Promise(async (resolve, reject) => {
                  try {
                        const dbTweets = await TweetsSchema.aggregate([
                              //sort , pagination, userId
                              { $match: { userId: userId } },
                              { $sort: { "creationDateTime": -1 } },
                              {
                                    $facet: {
                                          data: [{ "skip": parent(offset) }, { "$limit": constants.TWEETS_FOR_USER_LIMIT }]
                                    }
                              }
                        ]);
                        console.log(dbTweets);
                        resolve(dbTweets[0].data);
                  } catch (error) {
                        return reject(error);
                  }
            })

      }

      getTweetByTweetId() {
            return new Promise(async (resolve, reject) => {
                  try {
                        const singleTweet = await TweetsSchema.findOne({ _id: this.tweetId });
                        resolve(singleTweet);
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
}