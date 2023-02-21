const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
let verifyToken = require('../api/verifytoken');

const User = require('../../models/Users');

router.post('/login', async (req, res) => {
    var username = req.body.username;
    var password = req.body.password;
    try {
        let result = User.find({ username: username }, (err, data) => {
            if (data.length > 0) {
                const passwodValidator = bcrypt.compareSync(password, data[0].password);
                if (passwodValidator) {
                    jwt.sign({ username: username, id: data[0]._id }, "ILTToken", { expiresIn: "1d" },
                        (err, token) => {
                            if (err) {
                                res.status(500).json({ status: 'Error', message: err.message });
                            }
                            else {
                                res.status(200).json({ status: 'OK', data: data, "token": token });
                            }
                        })
                }
                else {
                    res.status(200).json({ status: 'Error', "message": "Invalid Password" });
                }
            }
            else {
                res.status(200).json({ status: 'Error', "message": "Invalid Username" });
            }
        })
    }
    catch (error) {
        res.status(500).json({ status: 'Error', message: error.message });
    }
});

//Check Login Status
router.post('/check-login-status', (req, resp) => {
    jwt.verify(req.body.token, "ILTToken", (err, decoded) => {
        if (decoded && decoded.username) {
            resp.status(200).json({ status: 'OK', "message": "Login status is active" });
        }
        else {
            resp.status(200).json({ status: 'Error', message: "Unauthorized User" });
        }
    })
})

//View All Users
router.get('/', verifyToken, async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json({ status: 'OK', data: users });
    }
    catch (error) {
        res.status(500).json({ status: 'Error', message: error.message });
    }
});

//View User by Id
router.get('/:id', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        res.status(200).json({ status: 'OK', data: user });
    }
    catch (error) {
        res.status(500).json({ status: 'Error', message: error.message });
    }
});

//Add User
router.post('/', verifyToken, async (req, res) => {
    let result = User.find({ username: req.body.username }, async (err, data) => {
        if (data.length > 0) {
            res.status(200).json({ status: 'Error', "message": "Username is already in use!" });
        }
        else {
            const data = new User({
                username: req.body.username,
                password: bcrypt.hashSync(req.body.password, 10),
                usertype: req.body.usertype
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

//Edit User
router.put('/', verifyToken, async (req, res) => {
    try {
        const id = req.body._id;
        const data = new User({
            _id: req.body._id,
            username: req.body.username,
            password: bcrypt.hashSync(req.body.password, 10),
            usertype: req.body.usertype
        });
        const result = await User.updateOne({ "_id": id }, data);
        res.status(200).json({ status: 'OK', data: result });
    }
    catch (err) {
        res.status(500).json({ status: 'Error', message: error.message });
    }
});

//Update User Type
router.put('/usertype', verifyToken, async (req, res) => {
    try {
        const id = req.body._id;
        const usrtype = req.body.usertype;
        const result = await User.updateOne(
            { "_id": id },
            { $set: { "usertype": usrtype } });
        res.status(200).json({ status: 'OK', data: result });
    }
    catch (error) {
        res.status(500).json({ status: 'Error', message: error.message });
    }
});

//Update Password
router.put('/password', verifyToken, async (req, res) => {
    try {
        const id = req.body._id;
        const pword = bcrypt.hashSync(req.body.password, 10);
        const result = await User.updateOne(
            { "_id": id },
            { $set: { "password": pword } });
        res.status(200).json({ status: 'OK', data: result });
    }
    catch (error) {
        res.status(500).json({ status: 'Error', message: error.message });
    }
});

//Delete User
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const id = req.params.id;
        const data = req.body;
        const result = await User.findOneAndDelete({ "_id": id }, data);
        res.status(200).json({ status: 'OK', data: result });
    }
    catch (err) {
        res.status(500).json({ status: 'Error', message: error.message });
    }
});

module.exports = router;