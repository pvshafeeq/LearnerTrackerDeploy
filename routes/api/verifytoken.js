var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');

router.use((req, res, next) => {
    var token = req.headers['x-access-token'];
    if (token) {
        jwt.verify(token, "ILTToken", (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: 'Unauthorized Access' });
            }
            if (decoded && decoded.username) {
                next();
            }
        });
    }
    else {
        return res.status(403).json({ message: 'Forbidden Access' });
    }
});

module.exports = router;