/**
 * Created by heweiguang on 2018/7/21.
 */

module.exports = function(app) {
  // 默认重定向到 /posts
  app.get('/', function(req, res) {
    res.redirect('/posts');
  });

  // 注册
  app.use('/signup', require('./signup'));

  // 登录
  app.use('/signin', require('./signin'));

  // 登出
  app.use('/signout', require('./signout'));

  // 文章
  app.use('/posts', require('./posts'));

  // 评论
  app.use('/comments', require('./comments'));

  // 404
  app.use(function (req, res) {
    console.log(res.headersSent); // res.headerSent 是一个判断 headers 是否被发送到客户端的 boolean 值
    if (!res.headersSent) {
      res.status(404).render('404');
    }
  });
};
