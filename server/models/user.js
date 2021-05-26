const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  __v:{type:Number,select:false},
  //用户名
  username: { type: String, required: true, minlength: 2, maxlength: 20 },
  // 邮箱  unique: true, //保证邮箱地址在插入的时候不重复
  email: { type: String, unique: true, required: true },
  // 密码
  password: { type: String, required: true },
  // 用户类型  //0:普通用户 1:管理员 2:超级管理员
  role: { type: Number, default: 0 },
  // 状态 //0:启用状态 1:禁用状态
  state: { type: Number, default: 0 },
  //头像
  user_img: {
    type:String
  }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
