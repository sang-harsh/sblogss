const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FollowSchema = new Schema({
      followedUserId: {
            type: Schema.Types.ObjectId,
            required: true
      },
      followerUserId: {
            type: Schema.Types.ObjectId,
            required: true
      },
      creationDateTime: {
            type: String,
            required: true
      }
}, { strict: false });

module.exports = mongoose.model('tb_follow', FollowSchema);