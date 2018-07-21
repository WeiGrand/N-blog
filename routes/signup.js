/**
 * Created by heweiguang on 2018/7/21.
 */

const fs = require('fs');
const path = require('path');
const sha1 = require('sha1');
const express = require('express');
const checkNotLogin = require('../middlewares/check').checkNotLogin;
const User = require('../models/userModel');

const router = express.Router();

router.get('/', checkNotLogin, function (req, res) {
  res.render('signup');
});

router.post('/', checkNotLogin, function (req, res, next) {
  let { password } = req.fields;

  const {
    name,
    gender,
    bio,
    repassword
  } = req.fields;

  const avatar = req.files.avatar.path.split(path.sep).pop();

  // 校验参数
  try {
    if (!(name.length >= 1 && name.length <= 10)) {
      throw new Error('名字请限制在 1-10 个字符');
    }

    if (['m', 'f', 'x'].indexOf(gender) === -1) {
      throw new Error('性别只能是 m、f 或 x');
    }

    if(!(bio.length >= 1 && bio.length <= 300)) {
      throw new Error('个人简介请限制在 1-30 个字符')
    }

    if (!req.files.avatar.name) {
      throw new Error('缺少头像')
    }

    if (password.length < 6) {
      throw new Error('密码至少 6 个字符')
    }

    if (password !== repassword) {
      throw new Error('两次输入密码不一致')
    }
  } catch(e) {
    console.log(e);
    // 注册失败，异步删除上传的头像
    fs.unlink(req.files.avatar.path);
    req.flash('error', e.message);

    return res.redirect('/signup');
  }

  password = sha1(password);

  User.create({
    name,
    password,
    gender,
    bio,
    avatar
  }).then(function(user) {
    // 删除密码这种敏感信息，将用户信息存入 session
    delete user.password;

    req.session.user = user;

    req.flash('success', '注册成功');

    res.redirect('/posts');
  }).catch(function(err) {
    fs.unlink(req.files.avatar.path);

    // 重复 unique key error MongoError: E11000 duplicate key error collection: n-blog.users index: name_1 dup key: { : "user1" }
    if (err.message.match('duplicate key')) {
      req.flash('error', '用户名已被占用');

      return res.redirect('/signup');
    }

    next(err);
  })
});

module.exports = router;
