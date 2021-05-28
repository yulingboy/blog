// 导入用户模型
const User = require('../models/user.js');
// 导入 joi
const joi = require('joi');
// 导入bcrypt模块
const bcrypt = require('bcrypt');

// 定义验证规则
const schema = joi.object({
  // username必须是字符串类型、最小长度是2、最大长度是6、必填项、自定义验证失败错误信息
  username: joi.string().min(2).max(6).error(new Error('用户名格式不正确')),
  // email必须是字符串类型、必须符合邮箱格式、必填项、自定义验证失败错误信息
  email: joi.string().email().required().error(new Error('邮箱格式不正确')),
  // password必须是字符串类型、必须符合指定的正则规则、自定义验证失败错误信息
  password: joi.string().regex(/^[a-zA-Z0-9]+$/).error(new Error('密码格式不正确')),
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
exports.login = async (req,res)=>{
    try{
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
     if(!user){
        return res.send({
            meta: { code: 1001, message: '该用户不存在' },
            data: null,
        });
      }
      // 如果用户存在，则需要验证密码是否正确，由于密码是加密过的，所以需要对密码进行解密对比
      // 比对密码是否正确
        const isVaild = await bcrypt.compare(req.body.password, user.password);
        // 如果比对失败
        if(!isVaild){
            return res.send({
                  meta: { code: 1001, message: '密码错误' },
                  data: null,
              });
        }else{
            // 密码正确
            res.send({
                meta: { code: 1000, message: '登录成功' },
                data: user,
            });
        }

    }catch(err){
        res.send({
            meta: { code: 1001, message: err.message },
            data: null,
          });
    }
}
