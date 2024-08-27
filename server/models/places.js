const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PlaceSchema = new Schema({
    name:String,
    province:String,
    state:String,
    latitude:Number,
    longitude:Number,
    notable_wildlife:[String]
})

module.exports = mongoose.model('Place',PlaceSchema)