# News简介

> News系统是 基于Node.js 平台开发的，集成的技术 为：
### express + express-session + formidable + mongodb + mongoose
### ueditor + body-parser + cors
> 功能：用户可通过ueditor在后台自由编辑新闻内容

> 状态：新闻状态分为 回收站、草稿、正式 

安装mongoDB 并运行 （可视化工具 推荐："MongoDB Compass"）

``` JavaScript
mongod --dbpath "xxx"
```

安装相关模块node_modules

``` JavaScript
 npm install
```

 修改数据库连接 文件路径：

``` JavaScript
 models/db.js
```

 运行项目

``` JavaScript
 node app.js
```
