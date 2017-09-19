var mongoose = require('mongoose');

//schema
var newsSchema = new mongoose.Schema({
    "title" : String,
    "content" : String,
    "author" : String,
    "showflag": Number,
    "sort": Number,
    "type" : Number,
    "coverimg" : String,
    "reading" : Number,
    "state" : Number,
    "time" : String,
    "updatatime" : String
});

//model
var News = mongoose.model("News",newsSchema);

module.exports = News;