安装express-jwt

```shell
npm install express-jwt
```

在根目录下创建middleware文件夹，并在里面创建jwt.js

导入公用变量和express-jwt

```shell
const config = require('../config/index');
const expressJWT = require('express-jwt');
```

解析jwt

```js
exports.jwtAuth = expressJWT({ secret: config.secretKey, algorithms: ['HS256'] }).unless({
    path:['/api/v1/blog/register','/api/v1/blog/login']
})
```

unless()表示该路径不需要token就能访问

使用中间件验证

```js
exports.isToken = (err, req, res, next) => {
    // 这次错误是由 token 解析失败导致的
    if (err.name === 'UnauthorizedError') {
      return res.send({
        status: 401,
        message: '无效的token',
      })
    }
    res.send({
      status: 500,
      message: '未知的错误',
    })
  }
```

在app.js中使用

```js
// 将 JWT 字符串还原为 JSON 对象 
app.use(jwt.jwtAuth);
// 使用中间件，判断token是否正确和过期
app.use(jwt.isToken);
```

解析成功后，可以使用req.user获取到token里的内容