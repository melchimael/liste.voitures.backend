const mongoose = require('mongoose');
const Schema = mongoose.Schema
const voituresSchema = new mongoose.Schema({
    modele:{
        type: String,
        required : true
    },
    marque:{
        type:String,
        required:true
    },
    annee:{
        type:String,
        required:true
    },
    couleur:{
        type:String,
        required:true
    },
    photo:{
        type:String,
        required:true
    }
})

const voitures = mongoose.model('voitures', voituresSchema); 
module.exports = voitures 