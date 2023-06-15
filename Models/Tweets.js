class Tweets {
      title;
      bodyText;
      userId;
      creationDateTime;

      constructor({ title, bodyText, userId, creationDateTime }) {
            this.title = title;
            this.bodyText = bodyText;
            this.userId = userId;
            this.creationDateTime = creationDateTime;
      }

      createTweet() {
            return new Promise((resolve, reject) => {
                  //this.title.trim();
                  //this.bodyText.trim();

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
}