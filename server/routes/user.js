// 导入用户模型
const User = require('../models/user.js');
// 导入 joi
const joi = require('joi');
// 导入bcrypt模块
const bcrypt = require('bcrypt');
// 导入用于生成JWT字符串的包
const jwt = require('jsonwebtoken');
// 引入config配置
const config = require('../config/index.js');

// 定义验证规则
const schema = joi.object({
  // username必须是字符串类型、最小长度是2、最大长度是6、必填项、自定义验证失败错误信息
  username: joi.string().min(2).max(6).error(new Error('用户名格式不正确')),
  // email必须是字符串类型、必须符合邮箱格式、必填项、自定义验证失败错误信息
  email: joi.string().email().required().error(new Error('邮箱格式不正确')),
  // password必须是字符串类型、必须符合指定的正则规则、自定义验证失败错误信息
  password: joi
    .string()
    .regex(/^[a-zA-Z0-9]+$/)
    .error(new Error('密码格式不正确')),
});

// 注册
exports.register = async (req, res) => {
  try {
    req.body = JSON.parse(JSON.stringify(req.body));
    // validate方法验证参数是否符合规则
    await schema
      .validateAsync(req.body)
      .then((val) => {})
      .catch((error) => {
        return res.send({
          meta: { code: 1001, message: error.message },
          data: null,
        });
      });

    // 在数据表中，我们规定了邮箱的唯一性，所以先根据注册邮箱查询该邮箱是否被注册
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      // 如果user存在，说明该邮箱已经被注册过了，不能够再次用来注册
      return res.send({
        meta: { code: 1001, message: '该邮箱已经被占用' },
        data: null,
      });
    } else {
      // 如果user不存在，说明该邮箱没有被注册过，可以用来注册

      // 生成随机字符串
      const salt = await bcrypt.genSalt(10);
      // 加密
      const password = await bcrypt.hash(req.body.password, salt);
      // 替换
      req.body.password = password;

      //   向数据库中写入
      const flag = await User.create(req.body);
      //   创建成功
      if (flag) {
        res.send({
          meta: { code: 1000, message: '注册成功' },
          data: null,
        });
      } else {
        // 创建失败
        res.send({
          meta: { code: 1001, message: '注册失败' },
          data: null,
        });
      }
    }
  } catch (err) {
    res.send({
      meta: { code: 1001, message: err.message },
      data: null,
    });
  }
};
// 登录
exports.login = async (req, res) => {
  try {
    req.body = JSON.parse(JSON.stringify(req.body));
    // validate方法验证参数是否符合规则
    await schema
      .validateAsync(req.body)
      .then((val) => {})
      .catch((error) => {
        return res.send({
          meta: { code: 1001, message: error.message },
          data: null,
        });
      });
    // 根据用户邮箱查询是否存在
    const user = await User.findOne({ email: req.body.email });
    // 如果没有，则说明该邮箱没有被注册
    if (!user) {
      return res.send({
        meta: { code: 1001, message: '该用户不存在' },
        data: null,
      });
    }
    // 如果用户存在，则需要验证密码是否正确，由于密码是加密过的，所以需要对密码进行解密对比
    // 比对密码是否正确
    const isVaild = await bcrypt.compare(req.body.password, user.password);
    // 如果比对失败
    if (!isVaild) {
      return res.send({
        meta: { code: 1001, message: '密码错误' },
        data: null,
      });
    } else {
      // 密码正确
      // 在登录成功之后，调用 jwt.sign() 方法生成 JWT 字符串。并通过 token 属性发送给客户端
      // 默认情况 Token 必须以 Bearer+空格 开头
      const payload = {
        email: user.email,
        username: user.username,
        role: user.role,
      };
      const token =
        'Bearer ' +
        jwt.sign(payload, config.secretKey, {
          expiresIn: 600 * 24 * 3,
        });
      res.send({
        meta: { code: 1000, message: '登录成功' },
        data: user,
        token,
      });
    }
  } catch (err) {
    res.send({
      meta: { code: 1001, message: err.message },
      data: null,
    });
  }
};
// 编辑用户信息
exports.edit = async (req, res) => {
  try {
    // 根据ID查询用户信息
    const user = await User.findOne({ _id: req.params.id });
    // 先判断是否有这个用户
    if (!user) {
      return res.send({
        meta: { code: 1001, message: '用户不存在' },
        data: null,
      });
    }
    // 如果发起请求的人不是当前登录人，或者角色不是超级管理员，则无法更改用户信息
    if (req.user.email == req.body.email || req.user.role == 2) {
      // 权限验证通过，可以修改用户信息
      req.body = JSON.parse(JSON.stringify(req.body));
      // 如果当前登录人不是超级管理员，那么不允许修改权限
      if(req.user.role && req.user.role != 2 && req.user.role != req.body.role ){
        return res.send({
            meta: { code: 1001, message: '权限不足' },
            data: null,
          });
      }
       // 生成随机字符串
       const salt = await bcrypt.genSalt(10);
       // 加密
       const password = await bcrypt.hash(req.body.password, salt);
       // 替换
       req.body.password = password;
      await User.findOneAndUpdate({ _id: req.params.id },{ $set: req.body },{ new: true })
        .then(() => {
          return res.send({
            meta: { code: 1000, message: '修改成功' },
            data: null,
          });
        })
        .catch((err) => {
          return res.send({
            meta: { code: 1001, message: err.message },
            data: null,
          });
        });
    } else {
      return res.send({
        meta: { code: 1001, message: '权限不足' },
        data: null,
      });
    }
  } catch (err) {
    return res.send({
      meta: { code: 1001, message: err.message },
      data: null,
    });
  }
};
// 根据id查询用户信息
exports.user = async (req,res) => {
    try{
        const user = await User.findOne({_id: req.params.id});
        if(user){
            return res.send({
                meta: { code: 1001, message: '获取成功' },
                data: user,
              });
        }else{
            return res.send({
                meta: { code: 1001, message: '用户不存在' },
                data: null,
              });
        }
    }catch(err){
        return res.send({
            meta: { code: 1001, message: err.message },
            data: null,
          });
    }
}
// 删除用户
exports.delete = async (req,res) => {
    try{
        // 判断登录用户是否为超级管理员，只有超级管理员才可以删除用户
        if(req.user.role != 2){
            return res.send({
                meta: { code: 1001, message: '权限不足' },
                data: null,
              });
        }
        const user = await User.findOne({_id: req.params.id});
        if(!user){
            return res.send({
                meta: { code: 1001, message: '用户不存在' },
                data: null,
              });
        }
        await User.findOneAndDelete({_id: req.params.id}).then(()=>{
            return res.send({
                meta: { code: 1001, message: '删除成功' },
                data: null,
              });
        }).catch(err=>{
            return res.send({
                meta: { code: 1001, message: '用户不存在' },
                data: null,
              });
        })
    }catch(err){
        return res.send({
            meta: { code: 1001, message: err.message },
            data: null,
          });
    }
}
// 分页查询用户列表
exports.users = async (req,res)=>{
    try{
        // 接收客户端传来的当前页参数
        let pageNum = +req.query.pageNum || 1;
        // 每一页显示的数据条数
        let pageSize = +req.query.pageSize || 10;
        // 查询用户数据的总数
        let total = await User.countDocuments({});
        //总页数
        let pageCount = Math.ceil(total / pageSize);
        //页码对应的数据查询开始位置
        let start = (pageNum - 1) * pageSize;
        // 从数据库中查询用户
        await User.find({}).limit(pageSize).skip(start).then((data)=>{
            return res.send({
                meta: { code: 1000, message: '获取成功' },
                data: data,
                pagition:{
                    pageNum: pageNum,  // 当前页
                    total: total, // 数据总数
                    pageSize: pageSize, // 每页条数
                    pageCount: pageCount, // 页数
                  }
              });
        }).catch(err=>{
            return res.send({
                meta: { code: 1001, message: err.message },
                data: null,
              });
        })
    }catch(err){
        return res.send({
            meta: { code: 1001, message: err.message },
            data: null,
          });
    }
}
