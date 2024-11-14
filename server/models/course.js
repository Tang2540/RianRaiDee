const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CourseSchema = new Schema({
    course_id: String,
    name:String,
    desc: String
})

module.exports = mongoose.model('Course',CourseSchema)