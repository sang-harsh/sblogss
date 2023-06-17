const FollowSchema = require('../Schemas/Follow');

function followNow({ followerUserId, followedUserId }) {
      return new Promise(async (resolve, reject) => {
            try {
                  //check this 
                  const followData = await UserSchema.findOne({ followedUserId: followedUserId, followerUserId: followerUserId });
                  if (followData)
                        reject("User Already Followwed");

                  const creationDateTime = new Data();

                  const followObj = new FollowSchema({
                        followerUserId, followedUserId, creationDateTime
                  })

                  const followResponse = await followObj.save();
                  resolve(followResponse);
            } catch (error) {
                  reject(error);
            }
      });
}

module.exports = { followNow };