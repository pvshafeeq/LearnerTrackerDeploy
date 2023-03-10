const mongoose =require('mongoose');
const UserSchema =new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    usertype:{
        type:String,
    }
});

module.exports = User = mongoose.model('user',UserSchema);