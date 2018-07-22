/**
 * Created by heweiguang on 2018/7/22.
 */

// 文章模型

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  pv: {
    type: Number,
    default: 0
  }
}, {
  timestamps: { // 设置 timestamps mongoose 会插入 `createdAt`，`updatedAt` 两个 fields，还可以指定 field name
    createdAt: 'created_at', // 为 `createdAt`
    updatedAt: 'updated_at'
  }
});

// 按创建时间降序查看用户的文章列表
PostSchema.index({
  author: 1,
  _id: -1
});

// 执行 find 之后触发钩子，将 markdown 转为 html
// PostSchema.post('find', function(posts) {
//   posts.forEach(function(post) {
//     post.content = marked(post.content);
//   })
// });

// PostSchema.post('findOne', function(post) {
//   if (post) {
//     post.content = marked(post.content);
//   }
// });

const Post = mongoose.model('Post', PostSchema);

module.exports = Post;
