全局安装express

```shell
npm install -g express
```

全局安装express命令行工具

```shell
npm install -g express-generator
```

查看express命令

```shell
express -help
```

```shell
 Usage: express [options] [dir]

  Options:

        --version        output the version number
    -e, --ejs            add ejs engine support
        --pug            add pug engine support
        --hbs            add handlebars engine support
    -H, --hogan          add hogan.js engine support
    -v, --view <engine>  add view <engine> support (dust|ejs|hbs|hjs|jade|pug|twig|vash) (defaults to jade)
        --no-view        use static html instead of view engine
    -c, --css <engine>   add stylesheet <engine> support (less|stylus|compass|sass) (defaults to plain css)
        --git            add .gitignore
    -f, --force          force on non-empty directory
    -h, --help           output usage information
```

这里我们不需要页面，所以使用`--no-view`

```shell
express server --no-view
```

进入文件夹

```shell
cd server
```

安装依赖

```shell
npm install
```

打开编辑器，将app.js改成自己需要的样子

```js
// 导入express模块
var express = require('express');
// 创建express服务器
var app = express();
// 启动服务器
app.listen(3000,()=>{
    console.log("服务器启动成功！")
})

```

启动服务器

```shell
node app.js
```

由于使用node启用服务器，需要每次修改完代码后，都需要重新启动命令，很不方便，所以可以安装nodemon来方便调试。nodemon是一种工具，可以自动检测到目录中的文件更改时通过重新启动应用程序来调试基于node.js的应用程序

```shell
npm install -g nodemon
```

重启服务器

```shell
nodemon app.js
```

