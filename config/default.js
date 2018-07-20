/**
 * Created by heweiguang on 2018/7/20.
 */

module.exports = {
  port: 3000, // 监听端口
  session: { // express-session 配置
    secret: 'defaultSecret',
    key: 'defaultKey',
    maxAge: 3600
  },
  mongodb: 'mongodb://localhost:27017/n-blog' // mongodb 地址
};
