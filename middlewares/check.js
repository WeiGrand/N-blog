/**
 * Created by heweiguang on 2018/7/21.
 */

// 权限控制
module.exports = {
  // 访问需要登录的页面，如果未登录跳转到登录页
  checkLogin: function(req, res, next) {
    if (!req.session.user) {
      req.flash('error', '未登录');

      return res.redirect('/signin');
    }

    next();
  },

  // 在已登录的情况下访问登录页则跳转回原来的页面
  checkNotLogin: function(req, res, next) {
    if (req.session.user) {
      req.flash('error', '已登录');

      return res.redirect('back');
    }

    next();
  }
};
