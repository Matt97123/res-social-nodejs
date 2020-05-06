const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = Schema({
  message: String,
  userid: String,
  createdat: String,
  updatedat: String,
});

module.exports = mongoose.model('Post', PostSchema);