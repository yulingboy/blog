// 导入express模块
const express = require('express');
// 创建路由实例
const router = express.Router();

// 将路由函数导入
const user = require('../../routes/user.js')

router.post('/register',user.register); // 注册

// 将对进行导出
module.exports = router;