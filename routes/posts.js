/**
 * Created by heweiguang on 2018/7/21.
 */

const express = require('express');
const marked = require('marked');
const checkLogin = require('../middlewares/check').checkLogin;
const Post = require('../models/postModel');
const Comment = require('../models/commentModel');

const router = express.Router();

// 文章列表
router.get('/', function(req, res, next) {
  const query = {};
  const { author } = req.query;

  if (author) {
    query.author = author;
  }

  Post.find(query).populate({
    path: 'author',
    model: 'User'
  }).sort({
    _id: -1
  }).then(function(posts) {
    // 添加评论数
    Promise.all(posts.map(post => {
      return Comment.find({
        postId: post._id
      }).then(function (comments) {
        post.content = marked(post.content);
        post.commentsCount = comments.length;

        return post;
      });
    })).then(function (posts) {
      res.render('posts', {
        posts
      })
    });
  }).catch(next);
});

// 文章发表页
router.get('/create', checkLogin, function(req, res) {
  res.render('create');
});

// 发表文章
router.post('/create', checkLogin, function(req, res, next) {
  const author = req.session.user._id;
  const {
    title,
    content
  } = req.fields;

  try {
    if (!title.length) {
      throw new Error('请填写标题');
    }

    if (!content.length) {
      throw new Error('请填写内容');
    }
  } catch(e) {
    req.flash('error', e.message);

    return res.redirect('back');
  }

  Post.create({
    author,
    title,
    content
  }).then(function(post) {
    req.flash('success', '发表成功');

    res.redirect(`/posts/${post._id}`);
  }).catch(next);

});

// 特定文章页
router.get('/:postId', function(req, res, next) {
  const {
    postId
  } = req.params;

  Promise.all([
    Post.findOne({
      _id: postId
    }).populate({
      path: 'author',
      model: 'User'
    }),
    Comment.find({
      postId
    }).populate({
      path: 'author',
      model: 'User'
    }).sort({
      _id: 1
    }),
    Post.update({
      _id: postId
    }, {
      $inc: {
        pv: 1
      }
    })
  ]).then(function(result) {
    const post = result[0];
    const comments = result[1];

    if (!post) {
      throw new Error('该文章不存在');
    }

    post.content = marked(post.content);

    Comment.find({
      postId: post._id
    }).then(function (res) {
      post.commentsCount = res.length;
    });

    res.render('post', {
      post,
      comments: comments.map(comment => {
        comment.content = marked(comment.content);
        return comment;
      })
    });
  }).catch(next);
});

// 文章编辑页
router.get('/:postId/edit', checkLogin, function(req, res, next) {
  const { postId } = req.params;
  const author = req.session.user._id;

  Post.findOne({
    _id: postId
  }).populate({
    path: 'author',
    model: 'User'
  }).then(function(post) {
    if (!post) {
      throw new Error('该文章不存在');
    }

    if (author.toString() !== post.author._id.toString()) {
      throw new Error('权限不足');
    }

    res.render('edit', {
      post
    })
  }).catch(next);
});

// 编辑文章
router.post('/:postId/edit', checkLogin, function(req, res, next) {
  const { postId } = req.params;

  const {
    title,
    content
  } = req.fields;

  try {
    if (!title.length) {
      throw new Error('请填写标题');
    }

    if (!content.length) {
      throw new Error('请填写内容');
    }
  } catch (e) {
    req.flash('error', e.message);

    return res.redirect('back');
  }

  Post.findOneAndUpdate({
    _id: postId
  }, {
    title,
    content
  }).then(function() {
    req.flash('success', '编辑文章成功');

    return res.redirect(`/posts/${postId}`);
  }).catch(next);
});

// 删除文章
router.get('/:postId/remove', checkLogin, function(req, res, next) {
  const { postId } = req.params;
  const author = req.session.user._id;

  Post.findOneAndRemove({
    _id: postId
  }).then(function() {
    req.flash('success', '删除文章成功');

    return res.redirect('/posts');
  }).catch(next);
});

module.exports = router;
