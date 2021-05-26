// 导入用户模型
const User = require('../models/user.js');

// 注册
exports.register = async (req, res) => {
  try {
      req.body = JSON.parse(JSON.stringify(req.body));
      console.log(req.body)
    //  先把用户注册必须要有的字段解构出来
    const { email, password, username } = req.body;
    console.log(email)
    // 判断邮箱是否满足格式要求
    const reg = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(.[a-zA-Z0-9-]+)*.[a-zA-Z0-9]{2,6}$/;
    console.log('1')
    console.log(reg.test(email))
    // if (!reg.test(email)) {
    //     console.log('2')
    //   return res.send({
    //     meta: { code: 1001, message: '邮箱格式不合法' },
    //     data: null,
    //   });
    // }
    console.log('3')
    // 在数据表中，我们规定了邮箱的唯一性，所以先根据注册邮箱查询该邮箱是否被注册
    const user = await User.findOne({ email: req.body.email });
    console.log(user)
    if (user) {
      // 如果user存在，说明该邮箱已经被注册过了，不能够再次用来注册
      return res.send({
        meta: { code: 1001, message: '该邮箱已经被占用' },
        data: null,
      });
    } else {
      // 如果user不存在，说明该邮箱没有被注册过，可以用来注册

      // 判断密码是否满足要求
      if (password.length < 6 || password.length > 12) {
        return res.send({
          meta: { code: 1001, message: '密码格式不符合要求' },
          data: null,
        });
      }
      //   判断用户名是否满足要求
      if (!username) {
        return res.send({
          meta: { code: 1000, message: '请输入用户名' },
          data: null,
        });
      }
      //   向数据库中写入
      console.log(req.body)
      const flag = await User.create(req.body);
      //   创建成功
      if (flag) {
        res.send({
          meta: { code: 1000, message: '注册用户成功' },
          data: null,
        });
      }
    }
  } catch (err) {
    res.send({
      meta: { code: 1001, message: err },
      data: null,
    });
  }
};
