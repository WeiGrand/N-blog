/**
 * Created by heweiguang on 2018/7/21.
 */

const express = require('express');
const checkLogin = require('../middlewares/check').checkLogin;

const router = express.Router();

router.get('/', checkLogin, function(req, res) {
  req.session.user = null;
  req.flash('success', '登出成功');

  return res.redirect('/posts');
});

module.exports = router;
