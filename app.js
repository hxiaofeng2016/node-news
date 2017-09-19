var express = require("express");
var app = express();
var router = require("./router/router.js");
var db = require("./models/db.js");
var path = require('path');
var session = require('express-session');
//跨域
var cors = require('cors');
app.use(cors());

//使用session
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}));

//模板引擎
app.set("view engine","ejs");
//静态页面
app.use(express.static("./public"));

//显示
app.get("/",router.showIndex);//显示首页
app.get("/index",router.showIndex); //显示首页
app.get("/login",router.showLogin); //显示登录页面
app.get("/onlogin",router.showOnLogin); // 退出账号业务
app.get("/upregist",router.showRegist); // 显示注册页面
app.get("/editornews/:id",router.showeditorNews); //显示 新闻编辑 页面
app.get("/newslist",router.showNewslist); //显示 新闻列表
app.get("/draft",router.showDraft); //显示 新闻草稿
app.get("/recycle",router.showRecycle); //显示 新闻回收站
app.get("/preview/:id",router.showPreview); //显示 预览页

//业务
app.post("/dologin",router.doLogin); //执行登录业务
app.post("/doregist",router.doRegist);//执行注册业务
app.post("/doeditornews",router.doeditorNews);//执行添加新闻业务
app.post("/doremovenews",router.doRemoveNews);//执行删除新闻业务
app.post("/doreduction",router.doReductionNews);//执行还原新闻业务
app.post("/dodeletenews",router.doDeleteNews);//执行delete新闻业务
app.post("/dofileimg",router.doFileimg);//执行 上传图片业务

//前端接口
app.post("/upnews",router.showUpnews); //显示 新闻列表
app.post("/upnewsid",router.showUpnewsid); //显示 新闻列表

//富文本编辑器
var ueditor = require("ueditor");
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

app.use("/ueditor/ueditor", ueditor(path.join(__dirname, 'public'), function(req, res, next) {
    // ueditor 客户发起上传图片请求
    if (req.query.action === 'uploadimage') {
        var foo = req.ueditor;
        var imgname = req.ueditor.filename;
        var img_url = '/images/ueditor/';
        //你只要输入要保存的地址 。保存操作交给ueditor来做
        res.ue_up(img_url);
    }
    //  客户端发起图片列表请求
    else if (req.query.action === 'listimage') {
        var dir_url = '/images/ueditor/';
        // 客户端会列出 dir_url 目录下的所有图片
        res.ue_list(dir_url);
    }
    // 客户端发起其它请求
    else {
        res.setHeader('Content-Type', 'application/json');
        res.redirect('/ueditor/nodejs/config.json');
    }
}));

app.listen(8081);