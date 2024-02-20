const friendsInteractor = require("../interactors/friends")
const Friends = require("../database/models/friends")

async function getFriends(req, res) {
    const username = req.username

    try {
        var friends = await friendsInteractor.findFriends({username, Friends})
        res.status(200).send({success: true, data: friends})
    } catch(e) {
        res.status(500).send({success: false, message: e.message})
    }
}

async function putFriend(req, res){
    const username       =  req.username;
    const friendUserName =  req.body.friend;

    try {
        var friends = await friendsInteractor.addFriend({username, friendUserName, Friends})
        res.status(200).send({success: true, data: friends})
    } catch(e) {
        res.status(500).send({success: false, message: e.message})
    }
}

// TODO
function deleteFriend(req, res){}


module.exports = { getFriends, putFriend }