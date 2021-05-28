// 导入express模块
var express = require('express');
// 导入body-parser 在post请求中，express本身不能解析请求体里的参数，需要用到'body-parser'插件
const bodyPaser = require('body-parser');
// 导入mongoose模块
require('./utils/db.js')

const jwt = require('./middleware/jwt')
// 导入路由
const v1 = require('./api/v1/index.js');
// 创建express服务器
var app = express();
// 解析post参数
app.use(bodyPaser.json());
// 处理post请求参数
app.use(bodyPaser.urlencoded({ extended: false }));
// 将 JWT 字符串还原为 JSON 对象 
app.use(jwt.jwtAuth);
// 使用中间件，判断token是否正确和过期
app.use(jwt.isToken);

app.use('/api/v1/blog', v1);
// 启动服务器
app.listen(3000,()=>{
    console.log("服务器启动成功！")
})
