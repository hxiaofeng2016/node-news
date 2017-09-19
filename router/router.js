var Users = require("../models/User.js");
var News = require("../models/News.js");
var md5 = require("../models/md5.js");
var ObjectId = require('mongodb').ObjectID;
var formidable = require("formidable");
var fs = require("fs");

//显示路由 ↓
//显示首页
exports.showIndex = function(req,res,next){
    if (req.session.login != "1") {
        return res.redirect('/login');
    }
    var user = req.session.user;
    Users.findOne({"user": user}, function (err, result) {
        News.find({"showflag" : "1"}, null, {"sort": {"time" : "-1"}},function(err,result2){
            res.render("index", {
                "students": result,
                "News" : result2
            });
        });
    });
};

//显示登录页
exports.showLogin = function(req,res,next){
    res.render("login");
};

//退出账户
exports.showOnLogin = function(req,res,next){
    req.session.login = "0";
    req.session.user = "";
    return res.redirect('/login');
};


//显示注册页
exports.showRegist = function(req,res,next){
    res.render("regist");
};

//显示 新闻编辑 页
exports.showeditorNews = function(req,res,next){
    if (req.session.login != "1") {
        return res.redirect('/login');
    }
    var user = req.session.user;
    var reqId = req.params["id"];
    Users.findOne({"user": user}, function (err, result) {
        if(reqId.length<15){
            res.render("editornews", {
                "students": result,
                "News": {
                "_id":null,
                "title":null,
                "coverimg":null,
                "time":null,
                "state":null,
                "type":null,
                "content":null,
                "sort":null
                }
            });
            return false;
        }else{
            var newsId = ObjectId(req.params["id"]);
            News.findOne({"_id": newsId},function(err, result2){
                res.render("editornews", {
                    "students": result,
                    "News": result2
                });
                return false;
            });
        }
    });
};

//显示 新闻列表
exports.showNewslist = function(req,res,next){
    if (req.session.login != "1") {
        return res.redirect('/login');
    }
    var user = req.session.user;
    Users.findOne({"user": user}, function (err, result) {
        News.find({"showflag" : "1","state" : "1"}, null, {"sort": {"time" : "-1"}},function(err,result2){
            res.render("newslist", {
                "students": result,
                "News" : result2
            });
        }).limit(10);
    });
};
//显示 新闻草稿
exports.showDraft = function(req,res,next){
    if (req.session.login != "1") {
        return res.redirect('/login');
    }
    var user = req.session.user;
    Users.findOne({"user": user}, function (err, result) {
        News.find({"showflag" : "1","state" : "0"},function(err,result2){
            res.render("draft", {
                "students": result,
                "News" : result2
            });
        });

    });
};
//显示 新闻回收站
exports.showRecycle = function(req,res,next){
    if (req.session.login != "1") {
        return res.redirect('/login');
    }
    var user = req.session.user;
    Users.findOne({"user": user}, function (err, result) {
        News.find({"showflag" : "0"},function(err,result2){
            res.render("newsrecycle", {
                "students": result,
                "News" : result2
            });
        });

    });
};

//显示 预览页
exports.showPreview = function(req,res,next){
    //显示修改界面
    var id = ObjectId(req.params["id"]);
    News.findOne({"_id":id},function(err,result){
        res.render("preview", {
            "News" : result
        });
    });
};



//业务路由 ↓

//登录业务
exports.doLogin = function(req,res,next){
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        var user = fields.user;
        var password = fields.password;
        var pwd = md5(md5(password) + "upal");
        Users.findOne({"user": user}, function (err, result) {
            if(err || !result){
                return res.send("-1"); //用户名不存在
            }
            if (pwd == result.password) {
                req.session.login = "1";
                req.session.user = user;
                return res.send("1");  //登陆成功
            } else {
                return res.send("-2");  //密码错误
            }
        });
    });
};

//注册业务
exports.doRegist = function(req,res,next){
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        var user = fields.user;
        Users.findOne({"user": user}, function (err, result) {
            if (err) {
                return res.send("-3"); //服务器错误
            }
            if (result) {
                return res.send("-1"); //被占用
            }
            var password = md5(md5(fields.password) + "upal");
            Users.create({
                "user" : user,
                "password" : password,
                "power" : 1
            },function(err, result){
                req.session.login = "1";
                req.session.user = user;
                return res.send("1"); //注册成功，写入session
            });
        });
    });
};

//编辑新闻 业务
exports.doeditorNews = function(req,res,next){
    var user = req.session.user;
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        Users.findOne({"user": user}, function (err, result) {
            News.find({}, function (err, resultnew) {
                if(fields._id != ""){
                    var id = ObjectId(fields._id);
                    var myfields = fields;
                    delete myfields["_id"];
                    News.update({"_id": id},myfields,function(err, result2){
                        if (err) {
                            console.log(err)
                            return res.send("-1"); //服务器错误
                        }
                        res.send("1"); //修改成功
                        return false;
                    });
                }else{
                    News.create({
                        "title" : fields.title,
                        "content" : fields.content,
                        "author" : result.name,
                        "showflag": 1,
                        "sort": fields.sort,
                        "state" : fields.state,
                        "coverimg" : fields.coverimg,
                        "type" : fields.type,
                        "reading" : 0,
                        "time" : fields.time,
                        "updatatime" : fields.time
                    },function(err, result2){
                        if(err){
                            res.send("-1"); //添加失败
                        }
                        return res.send(result2); //添加成功
                    });
                }
            });
            });
    });
};

//删除新闻 业务
exports.doRemoveNews = function(req,res,next){
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        var id = ObjectId(fields._id);
        News.update({"_id": id},{"showflag":0},function(err, result){
            if (err) {
                return res.send("-1"); //服务器错误
            }
            res.send("1"); //删除成功
            return false;
        });
    });
};

//还原新闻 业务
exports.doReductionNews = function(req,res,next){
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        var id = ObjectId(fields._id);
        News.update({"_id": id},{"showflag":1},function(err, result){
            if (err) {
                return res.send("-1"); //服务器错误
            }
            res.send("1"); //删除成功
            return false;
        });
    });
};
//delete新闻 业务
exports.doDeleteNews = function(req,res,next){
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        var id = ObjectId(fields._id);
        News.remove({"_id": id},function(err, result){
            if (err) {
                return res.send("-1"); //服务器错误
            }
            res.send("1"); //删除成功
            return false;
        });
    });
};
//临时目录
//上传图片业务 业务
exports.doFileimg = function(req,res,next){
    var form = new formidable.IncomingForm();
    form.uploadDir = 'public/images/newcover/';
    form.parse(req, function(err, fields, files) {
        if (files.modal_file) {
            var str = files.modal_file.name;
            var date = new Date();
            var newName = Math.round(date.getTime()*99+1) + str.substr(str.length-4);
            rename(files.modal_file.path, newName, 'preview');
            function rename(old, _new, code, bId) {
                var path = 'public/images/newcover/' + code + '/';
                fs.exists(path, function(exists) {
                    if (!exists) { //创建文件夹
                        fs.mkdir(path)
                    }
                    fs.renameSync(old, path + _new, function(err) {
                        if (err) {
                            console.log(err);
                            return;
                        }
                        console.log('上传成功!');
                        //return path;
                    })
                })
            }
            //console.log(path);
            res.send({
                stats:'success',
                src:newName
            })
        }
    })
};


//计算日期
getDate = function(){
    var date = new Date();
    this.Y = date.getFullYear();
    this.M = date.getMonth()+1 ;
    this.D = date.getDate();
    if(this.M < 10){
        this.M =  0 +"" + this.M;
    }
    if(this.D < 10){
        this.D =  0 +"" + this.D;
    }
    return this.Y + "-" + this.M + "-" + this.D;
}



//前端接口

//显示 新闻列表
exports.showUpnews = function(req,res,next){
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        News.find({"showflag" : "1","state" : 1}, null, {},function(err,result){
            News.find({"showflag" : "1","state" : 1}, null, {"sort": {"updatatime" : "-1"}},function(err,result2){
                if (err) {
                    return res.send("-1"); //服务器错误
                }
                res.send({"total":result.length,"newslit":result2}); //返回新闻
            }).limit(fields.length).skip(fields.page*fields.length);
        });
    });
};
//显示 新闻详情
exports.showUpnewsid = function(req,res,next){
    //显示修改界面
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        var id = ObjectId(fields.id);
        News.findOne({"_id":id},function(err,result){
            if (err) {
                return res.send("-1"); //服务器错误
            }
            res.send(result); //返回新闻
        });
    });
};