/**
 * Created by heweiguang on 2018/7/21.
 */

const express = require('express');
const sha1 = require('sha1');
const checkNotLogin = require('../middlewares/check').checkNotLogin;
const User = require('../models/userModel');

const router = express.Router();

router.get('/', checkNotLogin, function(req, res) {
  res.render('signin');
});

router.post('/', checkNotLogin, function(req, res, next) {
  const {
    name,
    password
  } = req.fields;

  try {
    if (!name.length) {
      throw new Error('请填写用户名')
    }

    if (!password.length) {
      throw new Error('请填写密码')
    }
  } catch (e) {
    req.flash('error', e.message);

    return res.redirect('back');
  }

  User.findOne({
    name
  }).then(function(user) {
    if (!user) {
      req.flash('error', '用户不存在');

      return res.redirect('back');
    }

    if (sha1(password) !== user.password) {
      req.flash('error', '用户名或密码错误');

      return res.redirect('back');
    }

    req.flash('success', '登录成功');

    delete user.password;

    req.session.user = user;

    res.redirect('/posts');
  }).catch(next);
});

module.exports = router;
