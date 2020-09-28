const jwt = require('jsonwebtoken')

function verifyToken(req, res, next) {
    const bearerHeader = req.headers["authorization"];
    if(typeof bearerHeader!== 'undefined'){
        const bearer = bearerHeader.split(' ')
        const bearerToken = bearer[1];
        req.token = bearerToken;
        next()
    }
    res.sendStatus(403)
}


module.exports = verifyToken