const config = require('../config/index');
const expressJWT = require('express-jwt');

exports.jwtAuth = expressJWT({ secret: config.secretKey, algorithms: ['HS256'] }).unless({
    path:['/api/v1/blog/register','/api/v1/blog/login']
})

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