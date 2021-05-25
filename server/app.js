// 导入express模块
var express = require('express');
// 导入mongoose模块
require('./utils/db.js')
// 创建express服务器
var app = express();
// 启动服务器
app.listen(3000,()=>{
    console.log("服务器启动成功！")
})