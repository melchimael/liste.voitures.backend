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
        type:String,
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

const voitures = mongoose.model('voitures', voituresSchema); 
module.exports = voitures 