/**
 * Created by heweiguang on 2018/7/21.
 */

const express = require('express');
const checkLogin = require('../middlewares/check').checkLogin;

const router = express.Router();

router.get('/', function(req, res) {
  res.render('posts');
});

router.get('/create', checkLogin, function(req, res) {
  res.send('发表文章页');
});

module.exports = router;
