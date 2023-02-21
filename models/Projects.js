const mongoose =require('mongoose');
const ProjectsSchema =new mongoose.Schema({
   projectCode:{
        type:String,
        required:true
    },
    projectName:{
        type:String,
        required:true
    }
});

module.exports = Project = mongoose.model('project',ProjectsSchema);