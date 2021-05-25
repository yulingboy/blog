// 导入mongoose模块
var mongoose = require('mongoose');
// 连接服务器
mongoose.connect('mongodb://localhost:27017/dataDb',{useNewUrlParser: true,useUnifiedTopology: true}, (err) =>{
    if(err){
        console.log('服务器连接失败' + err);
    }else{
        console.log('服务器连接成功！');
    }
  });