/**
 * Created by heweiguang on 2018/7/23.
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  postId: {
    type: Schema.Types.ObjectId,
    required: true
  }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

CommentSchema.index({
  postId: 1,
  _id: 1
});

const Comment = mongoose.model('Comment', CommentSchema);

module.exports = Comment;
