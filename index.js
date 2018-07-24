/**
 * Created by heweiguang on 2018/7/20.
 */

const path = require('path');
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');
const flash = require('connect-flash');
const config = require('config-lite')(__dirname);
const expressHandlebars = require('express-handlebars');
const expressFormidable = require('express-formidable');
const winston = require('winston');
const expressWinston = require('express-winston');
const routes = require('./routes');
const pkg = require('./package.json');

// 连接数据库
mongoose.connect(config.mongodb);

const app = express();

// 设置模版目录
const viewsPath = path.join(__dirname, 'views');
app.set('views', viewsPath);

// 设置模板引擎
app.engine('hbs', expressHandlebars({
  extname: '.hbs',
  helpers: {
    renderGender(gender) {
      return {m: '男', f: '女', x: '保密'}[gender];
    },
    ifEquals(arg1, arg2, options) {
      return (arg1.toString() === arg2.toString()) ? options.fn(this) : options.inverse(this);
    }
  },
  partialsDir: path.join(viewsPath, 'components') // 公用模块路径
}));
app.set('view engine', 'hbs');

// 设置静态文件目录
app.use(express.static(path.join(__dirname, 'public')));

// 设置
app.use(session({
  name: config.session.key, // 保存 session id 的 字段
  secret: config.session.secret,
  resave: true, // 强制更新 session
  saveUninitialized: false, // 即使用户为登录也会创建一个 session
  cookie: {
    maxAge: config.session.maxAge
  },
  store: new MongoStore({ // 将 session 存到 mongodb
    url: config.mongodb
  })
}));

app.use(flash());

// 使用 express-formidable 处理 form 表单（包括文件上传），表单普通字段挂载到 `req.fields` 上，表单上传后的文件挂载到 `req.files` 上
app.use(expressFormidable({
  uploadDir: path.join(__dirname, 'public/img'),
  keepExtensions: true // 保留后缀
}));

// res.locals 优先级高于 app.locals，res.locals 上通常挂载变量信息（每次请求可可能的值都不一样），app.locals 通常挂载常量信息
app.locals.blog = {
  title: pkg.name,
  description: pkg.description
};

// 添加模版必需的3个变量
app.use(function(req, res, next) {
  res.locals.user = req.session.user;
  res.locals.success = req.flash('success').toString();
  res.locals.error = req.flash('error').toString();

  next();
});

// 正常请求的日志
app.use(expressWinston.logger({
  transports: [
    new winston.transports.Console({
      json: true,
      colorize: true
    }),
    new winston.transports.File({
      filename: 'logs/success.log'
    })
  ]
}));

routes(app);

// 错误请求的日志
app.use(expressWinston.errorLogger({
  transports: [
    new winston.transports.Console({
      json: true,
      colorize: true
    }),
    new winston.transports.File({
      filename: 'logs/error.log'
    })
  ]
}));

// 简单的代码报错处理
app.use(function (err, req, res) {
  req.flash('error', err.message);

  res.redirect('/posts');
});

app.listen(config.port, function() {
  console.log(`${pkg.name} listening on port ${config.port}`);
});
