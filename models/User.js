var mongoose = require('mongoose');
//schema
var usersSchema = new mongoose.Schema({
    "user" : String,
    "password" : String,
    "name" : String,
    "power" : Number,
    "newslist" : [Number]
});
//model
var users = mongoose.model("users",usersSchema);
module.exports = users;