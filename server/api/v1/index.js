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
router.get('/users/:id',user.user); // 根据ID查询用户信息
router.delete('/users/:id',user.delete); // 删除用户信息
router.get('/users',user.users); // 查询用户列表

// 将对进行导出
module.exports = router;