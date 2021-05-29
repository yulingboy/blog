// 导入express模块
const express = require('express');
// 创建路由实例
const router = express.Router();

// 将路由函数导入
const user = require('../../routes/user.js')

// 引入权限中间件
const {isRole} = require('../../middleware/auth.js')

router.post('/register',user.register); // 注册
router.post('/login',user.login); // 登录

router.put('/users/:id',user.edit); // 编辑用户信息

// 将对进行导出
module.exports = router;