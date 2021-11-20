var mongoose = require('mongoose')
var Schema = mongoose.Schema

var schema = new Schema({
    title: {type:String, required: true},
    price: {type:String, required: true},
    description: {type:String, required: true},
    municipio: {type:String, required: true},
    image: {type:String, required: true},
    time: {type:String, required: true},
    user: {type:String, required: true},
    x: {type:String, required: true},
    y: {type:String, required: true},
    rooms: {type:String, required: true},
    fullBathrooms: {type:String, required: true},
    parking: {type:String, required: true},
    size: {type:String, required: true},
    halfBathrooms: {type:String, required: true},
    pool: {type:String, required: true},
    floors: {type:String, required: true},
    coto: {type:String, required: true},
    extraRooms: {type:String, required: true},
    balcones: {type:String, required: true},
    terraza: {type:String, required: true},
    cocina: {type:String, required: true},
    jardin: {type:String, required: true},
    aire: {type:String, required: true},
    partOfData: {type:String, required: true}
    
});

module.exports = mongoose.model('Post', schema);