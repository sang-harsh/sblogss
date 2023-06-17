const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
      username: { type: String, required: true, unique: true },
      email: { type: String, required: true, unique: true },
      name: { type: String, required: true, unique: false },
      password: { type: String, required: true, unique: false },
      phone: { type: String, required: false, unique: false },
}, { strict: false });

module.exports = mongoose.model('tb_user', userSchema);