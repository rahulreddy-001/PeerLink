const userInteractor = require("../interactors/user");

const auth = require("../services/auth")
const User = require("../database/models/user")
const Friends = require("../database/models/friends")

async function signup(req, res) {
    const {username, password} = req.body;
    try {
        await userInteractor.registerUser({username, password, User, Friends, auth})
        res.status(201).send({success : true, message : "Created"})
    } catch(err) {
        res.status(500).send({success : false, message : err.message})
    }
}

async function signin(req, res) {
    const {username, password} = req.body;
    try {
        const setCookie = await userInteractor.loginUser({username, password, User, auth})
        setCookie(res)
        res.status(200).send({success : true, message : "OK"})
    } catch(err) {
        res.status(500).send({success : false, message : err.message})
    }
}

async function signout(_, res) {
    const clearCookie = await userInteractor.logoutUser(res)
    clearCookie(res)
    res.status(200).send({success : true, message : "OK"})
}

module.exports = { 
    signup, signin, signout 
}
