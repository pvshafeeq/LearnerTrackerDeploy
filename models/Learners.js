const mongoose =require('mongoose');
const LearnersSchema =new mongoose.Schema({
   learnerId:{
        type:String,
        //required:true
    },
    learnerName:{
        type:String,
        //required:true
    },
    // roles: [
    //     {
    //       type: mongoose.Schema.Types.ObjectId,
    //       ref: "Role"
    //     }
    //   ],
    courseName:{
        type:String,
        //required:true
    },
    project:{
        type:String,
        //required:true
    },
    batch:{
        type:String,
        //required:true
    },
    courseStatus:{
        type:String,
        //required:true
    },
    placementStatus:{
        type:String
    }
});

module.exports = Learner = mongoose.model('learners',LearnersSchema);