const mongoose = require('mongoose');
// 引入剛剛畫好的草圖
const userSchema = require('../schema/user.schema'); 

module.exports = mongoose.model('User', userSchema);