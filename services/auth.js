var crypto = require('crypto');
var jwt = require('jsonwebtoken');
const key = require("../config").JWT_KEY

async function createHash({username, password}){
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha256').toString('hex');
    return {username, hash, salt}
}

async function verifyUser({ password, salt, hash}) {
    const hashToVerify = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha256').toString('hex');
    return hashToVerify === hash;
}

async function createJWT(username){
    return jwt.sign({username}, key)
}

async function authenticate(req, res, next){
    const token = req.cookies.access_token;
    if (!token) {
        return res.status(403).send({success : false, error : "Bad Request"})
    }

    try {
        const data = jwt.verify(token, key)
        req.username = data.username
        next();
    } catch(err) {
        return res.status(500).send({success : false, error : "Internal Server Error"})
    }

}

module.exports = {createHash, createJWT, verifyUser, authenticate}