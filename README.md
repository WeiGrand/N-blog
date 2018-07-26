# Learn Node.js by building a N-blog

[教程地址](https://github.com/nswbmw/N-blog)

> 因为个人喜好，并没有完全使用原教程所推荐 `Mongolass` mongo 驱动库和 `ejs` 模版引擎，取而代之的是 `Mongoose` 和 `handlebars`

使用 Express + MongoDB 搭建多人博客

## 运行

```bash
npm install
node index
```

## 开发环境

- Node.js: `8.9.1`
- MongoDB: `3.4.10`
- Express: `4.16.2`

## 目录结构

```
├── config 配置文件
├── index.js 入口
├── middlewares 中间件
├── models 数据库操作
├── public 静态资源
├── routes 路由
└── views 模板
```

## 功能与路由设计

1. 注册
 - 注册页 `GET /signup`
 - 注册 `POST /signup`
 
2. 登录
 - 登录页 `GET /signin`
 - 登录 `POST /signin`
 
3. 登出
 - `GET /signout`
 
4. 查看文章
 - 主页 `GET /posts`
 - 个人主页 `GET /posts?author=xxx`
 - 查看一篇文章 `GET /posts/:postId`
 
5. 发表文章
 - 发表文章页 `GET /posts/create`
 - 发表文章 `POST /posts/create`
 
6. 修改文章
 - 修改文章页 `GET /posts/:postId/edit`
 - 修改文章 `POST /posts/:postId/edit`
 
7. 删除文章
 - `GET /posts/:postId/remove`
  
