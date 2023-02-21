const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
let verifyToken = require('../api/verifytoken');

//Load Batch model
const Batch = require('../../models/Batches');

//View All Batch
router.get('/', verifyToken, async (req, res) => {
    try {
        const batches = await Batch.find();
        res.status(200).json({ status: 'OK', data: batches })
    }
    catch (error) {
        res.status(500).json({ status: 'Error', message: error.message })
    }
});

//View Batch by Id
router.get('/:id', verifyToken, async (req, res) => {
    try {
        const batch = await Batch.findById(req.params.id);
        res.status(200).json({ status: 'OK', data: batch })
    }
    catch (error) {
        res.status(500).json({ status: 'Error', message: error.message })
    }
});

//Add Batch
router.post('/', verifyToken, async (req, res) => {
    let result = Batch.find({ batchName: req.body.batchName }, async (err, data) => {
        if (data.length > 0) {
            res.status(200).json({ status: 'Error', "message": "Batch Name is already in use!" });
        }
        else {
            const data = new Batch({
                batchCode: req.body.batchCode,
                batchName: req.body.batchName
            });

            try {
                const dataToSave = await data.save();
                res.status(200).json({ status: 'OK', data: dataToSave })
            }
            catch (error) {
                res.status(500).json({ status: 'Error', message: error.message })
            }
        }
    });
});

//Edit Batch
router.put('/', verifyToken, async (req, res) => {
      try {
        const id = req.body._id;
            const data = req.body;
            const result = await Batch.updateOne({ "_id": id }, data);
            res.status(200).json({ status: 'OK', data: result })
    }
    catch (error) {
        res.status(500).json({ status: 'Error', message: error.message })
    }
});

//Delete Batch
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const id = req.params.id;
        const data = req.body;
        const result = await Batch.findOneAndDelete({ "_id": id }, data);
        res.status(200).json({ status: 'OK', data: result })
    }
    catch (error) {
        res.status(500).json({ status: 'Error', message: error.message })
    }
});

module.exports = router;