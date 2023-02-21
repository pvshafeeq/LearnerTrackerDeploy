const mongoose =require('mongoose');
const BatchesSchema =new mongoose.Schema({
   batchCode:{
        type:String,
        required:true
    },
    batchName:{
        type:String,
        required:true
    }
});

module.exports = Batch = mongoose.model('batch',BatchesSchema);