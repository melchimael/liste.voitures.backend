const mongoose = require('mongoose');
const Schema = mongoose.Schema
const usersSchema = new mongoose.Schema({
    nom:{
        type: String,
        required : true
    },
    mdp:{
        type:String,
        required:true
    }
})

const users = mongoose.model('users', usersSchema); 
module.exports = users 