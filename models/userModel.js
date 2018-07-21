/**
 * Created by heweiguang on 2018/7/21.
 */

// 用户模型

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    unique: true, // 唯一索引
    required: true
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    enum: ['m', 'f', 'x'],
    default: 'x'
  },
  bio: {
    type: String,
    required: true
  },
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
