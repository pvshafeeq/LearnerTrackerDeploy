const express = require('express');
const router = express.Router();
let verifyToken = require('../api/verifytoken');

//Load Learners model
const Learner = require('../../models/Learners');

//View All Learners
router.get('/', verifyToken, async (req, res) => {
    try {
        const learners = await Learner.find();
        res.status(200).json({ status: 'OK', data: learners })
    }
    catch (error) {
        res.status(500).json({ status: 'Error', message: error.message })
    }
});

//View Learner by Id
router.get('/:id', verifyToken, async (req, res) => {
    try {
        const learner = await Learner.findById(req.params.id);
        res.status(200).json({ status: 'OK', data: learner });
    }
    catch (error) {
        res.status(500).json({ status: 'Error', message: error.message });
    }
});

//Add Learner
router.post('/', verifyToken, async (req, res) => {
    let result = Learner.find({ learnerId: req.body.learnerId }, async (err, data) => {
        if (data.length > 0) {
            res.status(200).json({ status: 'Error', message: "Learner Id is already in use!" });
        }
        else {
            const data = new Learner({
                learnerId: req.body.learnerId,
                learnerName: req.body.learnerName,
                courseName: req.body.courseName,
                project: req.body.project,
                batch: req.body.batch,
                courseStatus: req.body.courseStatus,
                placementStatus: req.body.placementStatus
            });
            try {
                const dataToSave = await data.save();
                res.status(200).json({ status: 'OK', data: dataToSave });
            }
            catch (error) {
                res.status(500).json({ status: 'Error', message: error.message });
            }
        }
    });
});

//Bulk Upload Learner
router.post('/bulkupload', async (req, res) => {
    try {
        //console.log('req.body='+req.body);
        //const jData = jsonObj(req.body);
        console.log('req.body.length=' + req.body.length);
        var learnersSuccess = [];
        var learnersError = [];
var isOk=true;
        for (var i = 0; i < req.body.length; i++) {
            let result = Learner.find({ learnerId: req.body[i]['learnerId'] }, (err, data) => {
                if (data.length > 0) {
                    isOk=false;
                    return res.status(200).json({ status: 'Failed', "Message": "LearnerId duplication found, Upload failed!"});
                }
            })   
        }

    
        const dataToSave = await Learner.insertMany(req.body);
            res.status(200).json({ status: 'OK', "Message": "Records Inserted Successfully!" });
    }
    catch (error) {
        res.status(500).json({ status: 'Error', message: error.message });
    }
});


//Edit Learner
router.put('/', verifyToken, async (req, res) => {
    try {
        const id = req.body._id;
        const data = req.body;
        const result = await Learner.updateOne({ "_id": id }, data);
        res.status(200).json({ status: 'OK', data: result });
    }
    catch (error) {
        res.status(500).json({ status: 'Error', message: error.message });
    }
});

//Update Learner's Placement Status
router.put('/placementstatus', verifyToken, async (req, res) => {
    try {
        const id = req.body._id;
        const pstatus = req.body.placementStatus;
        const result = await Learner.updateOne(
            { "_id": id },
            { $set: { "placementStatus": pstatus } });
        res.status(200).json({ status: 'OK', data: result });
    }
    catch (error) {
        res.status(500).json({ status: 'Error', message: error.message });
    }
});

//Delete Course
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const id = req.params.id;
        const data = req.body;
        const result = await Learner.findOneAndDelete({ "_id": id }, data);
        res.status(200).json({ status: 'OK', data: result });
    }
    catch (error) {
        res.status(500).json({ status: 'Error', message: error.message });
    }
});

module.exports = router;