const mongoose =require('mongoose');
const CourseSchema =new mongoose.Schema({
    courseCode:{
        type:String,
        required:true
    },
    courseName:{
        type:String,
        required:true
    }
});

module.exports = Course = mongoose.model('course',CourseSchema);