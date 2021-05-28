由于很多接口需要携带token，所以需要对postman进行设置

点击Authorrization，选择Bearer Token

![image-20210529025822041](http://img.yulings.top/20210529025824.png)

在tests写一段代码，不会的可以看看右边的脚本命令

![image-20210529032554337](http://img.yulings.top/20210529032555.png)

```js
var jsonData = JSON.parse(responseBody);//将内容转换为json字符串
var token = jsonData.token.split(" ")[1]
pm.setEnvironmentVariable("token",token);
```

第一行的意思是把请求返回的参数解析为json格式

第二行的意思是，emmm，这个有个大坑，之前一直没有找到原因，后来才想起返回的token 多了“Bearer ”这个字段，得去掉

第三行就是把得到的token存放到token变量里

点击又上角这个按钮

![image-20210529032915142](http://img.yulings.top/20210529032916.png)

选择add

![image-20210529033005056](http://img.yulings.top/20210529033006.png)

填入信息

![image-20210529033229596](http://img.yulings.top/20210529033231.png)

点击Add,回到首页，选中刚才设置的环境

![image-20210529033347552](http://img.yulings.top/20210529033348.png)

再次发起请求，点击右上角的研究，可以看到已经有token了

![image-20210529033456628](http://img.yulings.top/20210529033457.png)

参考：https://www.cnblogs.com/mingyue5826/p/11001891.html