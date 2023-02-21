const express = require('express');
const router = express.Router();
let verifyToken = require('../api/verifytoken');

//Load Project model
const Project = require('../../models/Projects');

//View All Project
router.get('/', verifyToken, async (req, res) => {
    try {
        const projects = await Project.find();
        res.status(200).json({ status: 'OK', data: projects });
    }
    catch (error) {
        res.status(500).json({ status: 'Error', message: error.message });
    }
});

//View Project by Id
router.get('/:id', verifyToken, async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        res.status(200).json({ status: 'OK', data: project });
    }
    catch (error) {
        res.status(500).json({ status: 'Error', message: error.message });
    }
});

//Add Project
router.post('/', verifyToken, async (req, res) => {
    let result = Project.find({ projectName: req.body.projectName }, async (err, data) => {
        if (data.length > 0) {
            res.status(200).json({ status: 'Error', "message": "Project Name is already in use!" });
        }
        else {
            const data = new Project({
                projectCode: req.body.projectCode,
                projectName: req.body.projectName
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

//Edit Project
router.put('/', verifyToken, async (req, res) => {
    try {
        const id = req.body._id;
        const data = req.body;
        const result = await Project.updateOne({ "_id": id }, data);
        res.status(200).json({ status: 'OK', data: result });
    }
    catch (error) {
        res.status(500).json({ status: 'Error', message: error.message });
    }
});

//Delete Project
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const id = req.params.id;
        const data = req.body;
        const result = await Project.findOneAndDelete({ "_id": id }, data);
        res.status(200).json({ status: 'OK', data: result });
    }
    catch (error) {
        res.status(500).json({ status: 'Error', message: error.message });
    }
});

module.exports = router;