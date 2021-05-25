在根目录下创建文件夹models，然后在文件夹下创建user.js文件

第一步，导入mongoose模块

```js
const mongoose = require('mongoose');
```

第二步，创建集合规则

```js
const userSchema = new mongoose.Schema({
  // mongodb自带的字段，这里写上，方便隐藏
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
```

第三步，根据规则创建集合

```js
const User = mongoose.model('User', userSchema);
```

第四步，将集合进行导出

```js
module.exports = User;
```

对Schema中的一些参数进行说明：

`type`，该参数的数据类型，包含String，Number，Date，Buffer，Boolean，Mixed，Schema.Types.ObjectId，Array，等

`select`，查询的时候，是否返回该字段

`required`，是否必须，如果必须，那么创建的时候，就必须传入该字段，否则报错

`minlength`，最小长度

`maxlength`，最大长度

`unique`，唯一索引，如果为true，则添加的时候，该字段不能重复

`default`，默认值