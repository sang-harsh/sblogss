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

                  const tweet = new TweetSchema({
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
}