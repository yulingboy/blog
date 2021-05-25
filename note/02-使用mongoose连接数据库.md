安装mongoose

```shell
npm install mongoose
```

连接mongodb，在app.js中加入入以下代码

```js
// 导入mongoose模块
var mongoose = require('mongoose');
// 连接服务器
mongoose.connect('mongodb://localhost:27017/dataDb', (err) =>{
    if(err){
        console.log(err)
    }else{
        console.log('服务器连接成功！');
    }
  });
```

重启服务器，会发现，在命令行中会提示以下内容

```shell
(node:18684) DeprecationWarning: current URL string parser is deprecated, and will be removed in a future version. To use the new parser, pass option { useNewUrlParser: true } to MongoClient.connect.
(Use `node --trace-deprecation ...` to show where the warning was created)
(node:18684) [MONGODB DRIVER] Warning: Current Server Discovery and Monitoring engine is deprecated, and will be removed in a future version. To use the new Server Discover and Monitoring engine, pass option { useUnifiedTopology: true } to the MongoClient constructor.
```

我们只需要在连接数据库中的代码里加入以下字段就不会再有警告了

```js
{useNewUrlParser: true,useUnifiedTopology: true},
```

为了方便以后代码查找以及优化，我们把连接数据库的代码提取出来，在项目根目录下创建utils文件夹，然后在该文件夹下创建db.js，写入以下代码

```js
// 导入mongoose模块
var mongoose = require('mongoose');
// 连接服务器
mongoose.connect('mongodb://localhost:27017/dataDb',{useNewUrlParser: true,useUnifiedTopology: true}, (err) =>{
    if(err){
        console.log('服务器连接失败' + err);
    }else{
        console.log('服务器连接成功！');
    }
  });
```

在app.js中引入该文件

```js
require('./utils/db.js')
```

重启项目，依然能够成功连接数据库。

