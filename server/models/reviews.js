const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ReviewSchema = new Schema({
    course_id: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content:String,
    grade: String,
    sec: String,
    year: String,
    publish_date: String
})

module.exports = mongoose.model('Review',ReviewSchema)