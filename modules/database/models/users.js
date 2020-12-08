const mongoose = require('mongoose');
const {
  Schema,
} = mongoose;

const userSchema = new Schema({
  username: String,
  password: String,
  type: String,
  token: String,
});

const User = mongoose.model('User', userSchema);

module.exports = User;
