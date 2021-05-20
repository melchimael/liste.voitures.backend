const mongoose = require('mongoose');
const Schema = mongoose.Schema
const commentairesSchema = new mongoose.Schema({
    userId:{
        type: String,
        required : true
    },
    commentaire:{
        type:String,
        required:true
    },
    voitureId:{
        type:Schema.Types.ObjectId,
        required:true
    },
    nomUser:{
        type:String,
        required:true
    },
    date:{
        type:String,
        required:true
    }
})

const commentaires = mongoose.model('commentaires', commentairesSchema); 
module.exports = commentaires 