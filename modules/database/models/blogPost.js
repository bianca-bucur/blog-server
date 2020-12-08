const mongoose = require('mongoose');
const {
  Schema,
} = mongoose;

const commentSchema = new Schema({
  content: String,
  author: String,
  timeStamp: String,
  approvalStatus: Boolean,
});

const blogPostSchema = new Schema({
  content: String,
  title: String,
  author: String,
  timeStamp: String,
  category: String,
  comments: [commentSchema],
});

const BlogPost = mongoose.model('BlogPost', blogPostSchema);

module.exports = BlogPost;
