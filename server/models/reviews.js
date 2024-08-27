const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ReviewSchema = new Schema({
    place_id: { type: Schema.Types.ObjectId, ref: 'Place', required: true },
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content:String,
    ratings:Number
})

module.exports = mongoose.model('Review',ReviewSchema)