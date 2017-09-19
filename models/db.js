var mongoose = require('mongoose');
 mongoose.connect('mongodb://localhost/group');
//mongoose.connect('mongodb://test:test@14.23.35.106:60002/group',{useMongoClient: true});//连接远程数据库
var db = mongoose.connection;
db.once('open', function (callback) {
    console.log("数据库成功打开");
});

module.exports = db;