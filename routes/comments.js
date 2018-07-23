/**
 * Created by heweiguang on 2018/7/21.
 */

const express = require('express');
const checkLogin = require('../middlewares/check').checkLogin;
const Comment = require('../models/commentModel');

const router = express.Router();

// 创建一条留言
router.post('/', checkLogin, function(req, res, next) {
  const author = req.session.user._id;
  const {
    postId,
    content
  } = req.fields;

  try {
    if (!content.length) {
      throw new Error('请填写留言内容');
    }
  } catch (e) {
    req.flash('error', e.message);

    return res.redirect('back');
  }

  Comment.create({
    author,
    postId,
    content
  }).then(function() {
    req.flash('success', '留言成功');

    return res.redirect('back');
  }).catch(next);
});

router.get('/:commentId/remove', checkLogin, function(req, res, next) {
  const { commentId } = req.params;
  const author = req.session.user._id;

  Comment.findOne({
    _id: commentId
  }).then(function(comment) {
    if (!comment) {
      throw new Error('留言不存在');
    }

    if (comment.author.toString() !== author.toString()) {
      throw new Error('没有权限删除留言')
    }

    Comment.findOneAndRemove({
      _id: commentId
    }).then(function() {
      req.flash('success', '删除留言成功');

      return res.redirect('back');
    }).catch(next);
  }).catch(next);
});

module.exports = router;
